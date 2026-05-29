export const ROLES = ["Super Admin", "Admin", "Viewer", "None"] as const;
export type RoleType = typeof ROLES[number];

export interface UserPermissions {
  ringkasan: RoleType;
  peta: RoleType;
  mitra: RoleType;
  penjualan: RoleType;
  transaksi: RoleType;
  produk: RoleType;
  jadwal: RoleType;
  akses: RoleType;
}

export interface UserAccount {
  id: number;
  nama: string;
  email: string;
  password?: string;
  hak_akses: UserPermissions;
}

export const DEFAULT_USER: UserAccount = {
  id: 1,
  nama: "Admin Utama",
  email: "admin@gmgconsole.id",
  password: "password123",
  hak_akses: {
    ringkasan: "Super Admin",
    peta: "Super Admin",
    mitra: "Super Admin",
    penjualan: "Super Admin",
    transaksi: "Super Admin",
    produk: "Super Admin",
    jadwal: "Super Admin",
    akses: "Super Admin",
  }
};

export const MOCK_USERS: UserAccount[] = [
  DEFAULT_USER,
  {
    id: 2,
    nama: "Siska Saraswati",
    email: "siska@workhub.com",
    password: "adminpassword",
    hak_akses: {
      ringkasan: "Admin",
      peta: "Admin",
      mitra: "Admin",
      penjualan: "Admin",
      transaksi: "Admin",
      produk: "Admin",
      jadwal: "Admin",
      akses: "None"
    }
  },
  {
    id: 3,
    nama: "Agus Subarjo",
    email: "agus@workhub.com",
    password: "viewerpass",
    hak_akses: {
      ringkasan: "Viewer",
      peta: "Viewer",
      mitra: "None",
      penjualan: "None",
      transaksi: "None",
      produk: "Viewer",
      jadwal: "None",
      akses: "None"
    }
  }
];

export function getCurrentUser(): UserAccount {
  try {
    const saved = localStorage.getItem('currentUser');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return DEFAULT_USER;
}

export function setCurrentUser(user: UserAccount) {
  localStorage.setItem('currentUser', JSON.stringify(user));
  // force a simple reload to apply sidebar changes
  window.dispatchEvent(new Event("storage"));
}

export function hasAccess(featureAccess: RoleType) {
  return featureAccess !== "None";
}
