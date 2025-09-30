import { addDays, addMinutes, eachMinuteOfInterval, set, startOfWeek, subMinutes } from "date-fns";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const DEFAULT_TZ = process.env.APP_TZ ?? "Asia/Tokyo";

const SLOT_STATUS_AVAILABLE = "available";
const SLOT_STATUS_BOOKED = "booked";

function buildSlots() {
  const now = new Date();
  const zonedNow = utcToZonedTime(now, DEFAULT_TZ);
  const monday = startOfWeek(zonedNow, { weekStartsOn: 1 });
  const intervals: Array<[number, number, number, number]> = [
    [9, 0, 12, 0],
    [13, 0, 18, 0]
  ];

  const slots: Prisma.SlotCreateManyInput[] = [];

  for (let day = 0; day < 5; day += 1) {
    const currentDay = addDays(monday, day);
    for (const [startHour, startMinute, endHour, endMinute] of intervals) {
      const intervalStart = set(currentDay, {
        hours: startHour,
        minutes: startMinute,
        seconds: 0,
        milliseconds: 0
      });
      const intervalEnd = set(currentDay, {
        hours: endHour,
        minutes: endMinute,
        seconds: 0,
        milliseconds: 0
      });

      const startTimes = eachMinuteOfInterval(
        {
          start: intervalStart,
          end: subMinutes(intervalEnd, 30)
        },
        { step: 30 }
      );

      for (const startTime of startTimes) {
        const endTime = addMinutes(startTime, 30);
        slots.push({
          start: zonedTimeToUtc(startTime, DEFAULT_TZ),
          end: zonedTimeToUtc(endTime, DEFAULT_TZ),
          status: SLOT_STATUS_AVAILABLE
        });
      }
    }
  }

  return slots;
}

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.consent.deleteMany();
  await prisma.screening.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.slot.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.patient.deleteMany();

  const patient = await prisma.patient.create({
    data: {
      name: "山田 太郎",
      kana: "ヤマダ タロウ",
      email: "yamada@example.com",
      phone: "+819012345678",
      dob: new Date("1990-01-01T00:00:00+09:00"),
      isFamily: false
    }
  });

  const inquiry = await prisma.inquiry.create({
    data: {
      nickname: "ご家族A",
      email: "family@example.com",
      role: "family",
      message: "家族のギャンブル問題について相談したい。",
      channel: "email"
    }
  });

  const slots = buildSlots();
  const createdSlots = await prisma.slot.createMany({ data: slots });

  const firstSlot = await prisma.slot.findFirst({ where: { status: SLOT_STATUS_AVAILABLE } });

  if (firstSlot) {
    await prisma.slot.update({
      where: { id: firstSlot.id },
      data: { status: SLOT_STATUS_BOOKED }
    });

    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        slotId: firstSlot.id,
        type: "first",
        status: SLOT_STATUS_BOOKED,
        videoUrl: "https://example.com/meet/demo"
      }
    });

    await prisma.consent.createMany({
      data: [
        {
          patientId: patient.id,
          appointmentId: appointment.id,
          type: "privacy",
          version: "v1"
        },
        {
          patientId: patient.id,
          appointmentId: appointment.id,
          type: "telemedicine",
          version: "v1"
        }
      ]
    });

    await prisma.auditLog.createMany({
      data: [
        {
          action: "created_inquiry",
          inquiryId: inquiry.id,
          target: `Inquiry:${inquiry.id}`,
          meta: JSON.stringify({ nickname: inquiry.nickname })
        },
        {
          action: "created_appointment",
          appointmentId: appointment.id,
          target: `Appointment:${appointment.id}`,
          meta: JSON.stringify({ patient: patient.name })
        }
      ]
    });
  }

  await prisma.screening.create({
    data: {
      patientId: patient.id,
      score: 6,
      answers: JSON.stringify({ q1: 2, q2: 1, q3: 0, q4: 1, q5: 1, q6: 0, q7: 1 }),
      risk: "Moderate"
    }
  });

  console.log(`Created ${createdSlots.count} slots for the current week.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
