// モックデータ - データベース接続なしで動作させるため

export const mockDoctors = [
  {
    id: "1",
    name: "田中 太郎",
    specialization: "依存症専門医",
    bio: "ギャンブル依存症治療の専門家として10年以上の経験",
    availability: ["月曜日", "水曜日", "金曜日"]
  },
  {
    id: "2",
    name: "佐藤 花子",
    specialization: "臨床心理士",
    bio: "認知行動療法を専門とする臨床心理士",
    availability: ["火曜日", "木曜日"]
  }
];

export const mockSlots = [
  {
    id: "1",
    doctorId: "1",
    startTime: new Date("2025-10-01T10:00:00"),
    endTime: new Date("2025-10-01T11:00:00"),
    isAvailable: true,
    isBooked: false
  },
  {
    id: "2",
    doctorId: "1",
    startTime: new Date("2025-10-01T14:00:00"),
    endTime: new Date("2025-10-01T15:00:00"),
    isAvailable: true,
    isBooked: false
  },
  {
    id: "3",
    doctorId: "2",
    startTime: new Date("2025-10-02T10:00:00"),
    endTime: new Date("2025-10-02T11:00:00"),
    isAvailable: true,
    isBooked: false
  }
];

export const mockAppointments = [
  {
    id: "1",
    patientId: "patient1",
    doctorId: "1",
    slotId: "1",
    status: "confirmed",
    notes: "初回カウンセリング",
    createdAt: new Date("2025-09-20T10:00:00"),
    updatedAt: new Date("2025-09-20T10:00:00"),
    patient: {
      id: "patient1",
      name: "山田 一郎",
      email: "yamada@example.com",
      phone: "090-1234-5678"
    },
    doctor: mockDoctors[0],
    slot: mockSlots[0]
  }
];

export const mockPatients = [
  {
    id: "patient1",
    name: "山田 一郎",
    email: "yamada@example.com",
    phone: "090-1234-5678",
    dateOfBirth: new Date("1985-05-15"),
    address: "東京都渋谷区",
    emergencyContact: "090-8765-4321",
    createdAt: new Date("2025-09-01T10:00:00")
  }
];

export const mockScreenings = [
  {
    id: "1",
    patientId: "patient1",
    score: 7,
    category: "moderate",
    responses: {
      q1: 3,
      q2: 2,
      q3: 2
    },
    createdAt: new Date("2025-09-15T10:00:00")
  }
];

export const mockInquiries = [
  {
    id: "1",
    name: "鈴木 次郎",
    email: "suzuki@example.com",
    subject: "カウンセリングについて",
    message: "初回カウンセリングの流れを教えてください",
    status: "pending",
    createdAt: new Date("2025-09-25T10:00:00")
  }
];