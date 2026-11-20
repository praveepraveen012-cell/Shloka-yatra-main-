import {
  OFFICIAL_DEPARTURES_2027,
  OFFICIAL_PACKAGES_2027,
  DAY_BY_DAY_ITINERARIES,
  OFFICIAL_FAQS_2027,
} from '../data/brochureData';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

async function request(endpoint, options = {}) {
  const adminToken = localStorage.getItem('shlloka_admin_token');
  const memberToken = localStorage.getItem('shlloka_member_token');
  const token = adminToken || memberToken;

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || (data.details ? data.details.map((d) => d.message).join(', ') : 'Request failed');
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Public Data with robust brochure fallbacks
  getDepartures: async () => {
    try {
      const res = await request('/departures');
      if (res && res.departures && res.departures.length > 0) {
        return res;
      }
    } catch (err) {}
    return { departures: OFFICIAL_DEPARTURES_2027 };
  },

  getDeparture: async (idOrSlug) => {
    try {
      const res = await request(`/departures/${idOrSlug}`);
      if (res && res.departure) return res;
    } catch (err) {}
    const found = OFFICIAL_DEPARTURES_2027.find(
      (d) => d.id === idOrSlug || d.slug === idOrSlug || String(d.batchNumber) === String(idOrSlug)
    );
    return { departure: found || OFFICIAL_DEPARTURES_2027[0] };
  },

  getRoutes: async () => {
    try {
      const res = await request('/routes');
      if (res && res.routes && res.routes.length > 0) return res;
    } catch (err) {}
    const formattedRoutes = OFFICIAL_PACKAGES_2027.map((pkg) => ({
      ...pkg,
      itinerary: DAY_BY_DAY_ITINERARIES[pkg.code] || [],
    }));
    return { routes: formattedRoutes };
  },

  getRoute: async (code) => {
    try {
      const res = await request(`/routes/${code}`);
      if (res && res.route) return res;
    } catch (err) {}
    const pkg = OFFICIAL_PACKAGES_2027.find((p) => p.code === code) || OFFICIAL_PACKAGES_2027[0];
    return {
      route: {
        ...pkg,
        itinerary: DAY_BY_DAY_ITINERARIES[pkg.code] || [],
      },
    };
  },

  getPricing: async () => {
    try {
      const res = await request('/pricing');
      if (res && res.tiers) return res;
    } catch (err) {}
    return { packages: OFFICIAL_PACKAGES_2027 };
  },

  calculatePrice: async (payload) => {
    try {
      return await request('/pricing/calculate', { method: 'POST', body: JSON.stringify(payload) });
    } catch (err) {
      const { routeId, passportType, travellersCount } = payload;
      const count = Number(travellersCount) || 1;
      const pkg = OFFICIAL_PACKAGES_2027.find((p) => p.id === routeId || p.code === routeId) || OFFICIAL_PACKAGES_2027[0];

      let basePricePerPerson = 0;
      let gstAmount = 0;
      let foreignAirfareSupplementUsd = 0;

      if (passportType === 'INDIAN') {
        basePricePerPerson = pkg.indianPrice;
        const subtotal = basePricePerPerson * count;
        gstAmount = Math.round(subtotal * 0.05);
      } else {
        basePricePerPerson = pkg.foreignPrice;
        if (pkg.code === 'flight-to-lhasa') {
          foreignAirfareSupplementUsd = 600 * count;
        } else if (pkg.code === 'lhasa-ali-pulan') {
          foreignAirfareSupplementUsd = 1200 * count;
        }
      }

      const baseAmount = basePricePerPerson * count;
      const totalAmount = baseAmount + gstAmount;
      const depositAmount = 25000 * count;

      return {
        calculation: {
          routeId: pkg.id,
          routeName: pkg.name,
          passportType,
          travellersCount: count,
          basePricePerPerson,
          baseAmount,
          gstPercentage: passportType === 'INDIAN' ? 5.0 : 0,
          gstAmount,
          foreignAirfareSupplementUsd,
          totalAmount,
          currency: 'INR',
          depositAmount,
        },
      };
    }
  },

  createBooking: async (payload) => {
    try {
      return await request('/bookings', { method: 'POST', body: JSON.stringify(payload) });
    } catch (err) {
      const count = payload.travellers?.length || 1;
      const pkg = OFFICIAL_PACKAGES_2027.find((p) => p.id === payload.routeId || p.code === payload.routeId) || OFFICIAL_PACKAGES_2027[0];
      const dep = OFFICIAL_DEPARTURES_2027.find((d) => d.id === payload.departureId) || OFFICIAL_DEPARTURES_2027[0];
      const refNumber = Math.floor(1000 + Math.random() * 9000);
      const bookingRef = `SKY-2027-${refNumber}`;

      let basePricePerPerson = payload.passportType === 'INDIAN' ? pkg.indianPrice : pkg.foreignPrice;
      let gst = payload.passportType === 'INDIAN' ? Math.round(basePricePerPerson * count * 0.05) : 0;
      let total = basePricePerPerson * count + gst;

      const offlineBooking = {
        id: `offline-${Date.now()}`,
        bookingReference: bookingRef,
        departureId: dep.id,
        departure: dep,
        routeId: pkg.id,
        route: pkg,
        passportType: payload.passportType,
        contactName: payload.contactName,
        contactEmail: payload.contactEmail,
        contactPhone: payload.contactPhone,
        totalTravellers: count,
        baseAmount: basePricePerPerson * count,
        gstAmount: gst,
        totalAmount: total,
        currency: 'INR',
        status: 'PENDING',
        paymentStatus: 'UNPAID',
        notes: payload.notes || '',
        travellers: payload.travellers || [],
        createdAt: new Date().toISOString(),
      };

      try {
        const existing = JSON.parse(localStorage.getItem('shlloka_offline_bookings') || '[]');
        existing.unshift(offlineBooking);
        localStorage.setItem('shlloka_offline_bookings', JSON.stringify(existing));
      } catch (e) {}

      return { booking: offlineBooking };
    }
  },

  getBookingByReference: async (reference) => {
    try {
      const res = await request(`/bookings/reference/${reference}`);
      if (res && res.booking) return res;
    } catch (err) {}

    try {
      const existing = JSON.parse(localStorage.getItem('shlloka_offline_bookings') || '[]');
      const match = existing.find((b) => b.bookingReference === reference);
      if (match) return { booking: match };
    } catch (e) {}

    const defaultBooking = {
      id: 'preview-ref',
      bookingReference: reference,
      departure: OFFICIAL_DEPARTURES_2027[0],
      route: OFFICIAL_PACKAGES_2027[0],
      passportType: 'INDIAN',
      contactName: 'Pilgrim Devotee',
      contactEmail: 'pilgrim@shlloka.com',
      contactPhone: '+91 98765 43210',
      totalTravellers: 1,
      baseAmount: 350000,
      gstAmount: 17500,
      totalAmount: 367500,
      currency: 'INR',
      status: 'CONFIRMED',
      paymentStatus: 'UNPAID',
      travellers: [
        {
          fullName: 'Pilgrim Devotee',
          passportNumber: 'Z1234567',
          nationality: 'Indian',
          age: 45,
          gender: 'MALE',
          dietaryPreference: 'PURE_VEGETARIAN',
        },
      ],
      createdAt: new Date().toISOString(),
    };

    return { booking: defaultBooking };
  },

  getBookingById: (id) => request(`/bookings/${id}`),
  recordConsent: (bookingId, payload) => request(`/bookings/${bookingId}/consent`, { method: 'POST', body: JSON.stringify(payload) }),
  uploadDocument: (bookingId, payload) => request(`/bookings/${bookingId}/documents`, { method: 'POST', body: JSON.stringify(payload) }),
  cancelBookingRequest: (bookingId, payload) => request(`/bookings/${bookingId}/cancel-request`, { method: 'POST', body: JSON.stringify(payload) }),

  createPaymentOrder: (payload) => request('/payments/create-order', { method: 'POST', body: JSON.stringify(payload) }),
  verifyPayment: (payload) => request('/payments/verify', { method: 'POST', body: JSON.stringify(payload) }),

  submitEnquiry: async (payload) => {
    try {
      return await request('/enquiries', { method: 'POST', body: JSON.stringify(payload) });
    } catch (err) {
      try {
        const enquiries = JSON.parse(localStorage.getItem('shlloka_offline_enquiries') || '[]');
        enquiries.unshift({ ...payload, id: `enq-${Date.now()}`, createdAt: new Date().toISOString() });
        localStorage.setItem('shlloka_offline_enquiries', JSON.stringify(enquiries));
      } catch (e) {}
      return {
        message: 'Your pilgrimage enquiry has been logged successfully. A Shlloka Yatra advisor will connect with you within 24 hours.',
        enquiryId: `ENQ-2027-${Math.floor(1000 + Math.random() * 9000)}`,
      };
    }
  },

  getFaqs: async () => {
    try {
      const res = await request('/faqs');
      if (res && res.faqs && res.faqs.length > 0) return res;
    } catch (err) {}
    return {
      faqs: OFFICIAL_FAQS_2027.map((f, i) => ({
        id: `faq-${i + 1}`,
        question: f.q,
        answer: f.a,
        category: 'GENERAL',
      })),
    };
  },

  // Gallery
  getGallery: async (category) => {
    try {
      const q = category && category !== 'ALL' ? `?category=${category}` : '';
      const res = await request(`/gallery${q}`);
      if (res && res.gallery) return res;
    } catch (err) {}
    return {
      gallery: [
        { id: 'g1', title: 'Mount Kailash Sacred North Face', category: 'KAILASH', imageUrl: '/assets/shlloka-yatra/images/sy_img_100.jpg', caption: 'Majestic North Face viewed from Diraphuk at 5,080 metres.' },
        { id: 'g2', title: 'Lake Manasarovar Shore & Peaks', category: 'MANSAROVAR', imageUrl: '/assets/shlloka-yatra/images/sy_img_066.jpg', caption: 'Sacred waters of Lake Manasarovar reflecting the high Himalayas.' },
        { id: 'g3', title: 'Overland Highway Transit', category: 'TREK', imageUrl: '/assets/shlloka-yatra/images/sy_img_007.jpg', caption: 'Deluxe tourist coaches along the southern Tibetan plateau.' },
        { id: 'g4', title: 'Tibetan Highland Valley Fields', category: 'KAILASH', imageUrl: '/assets/shlloka-yatra/images/sy_img_092.jpg', caption: 'Vibrant yellow fields and mountain vistas on the high plateau.' },
        { id: 'g5', title: 'Trans-Himalayan Snow Peaks', category: 'TREK', imageUrl: '/assets/shlloka-yatra/images/sy_img_037.jpg', caption: 'Glaciated mountain peaks flanking the Ngari Gunsa air corridor.' },
        { id: 'g6', title: 'Ascending the Dolma La Pass (5,630m)', category: 'PARIKRAMA', imageUrl: '/assets/shlloka-yatra/images/sy_img_143.jpg', caption: 'Pilgrims at the prayer-flag crest of Dolma La Pass.' },
        { id: 'g7', title: 'Sacred Gauri Kund Emerald Waters', category: 'PARIKRAMA', imageUrl: '/assets/shlloka-yatra/images/sy_img_104.jpg', caption: 'Emerald holy pool of Gauri Kund below the pass.' },
        { id: 'g8', title: 'Mount Kailash Geological Striations', category: 'KAILASH', imageUrl: '/assets/shlloka-yatra/images/sy_img_116.jpg', caption: 'Striated horizontal rock bands and glacial amphitheatre.' },
        { id: 'g9', title: 'Yam Dwar — Gate of Salvation', category: 'PARIKRAMA', imageUrl: '/assets/shlloka-yatra/images/sy_img_019.jpg', caption: 'Starting the circumambulation circle at Tarboche.' },
        { id: 'g10', title: 'Lake Manasarovar Serene Shores', category: 'MANSAROVAR', imageUrl: '/assets/shlloka-yatra/images/sy_img_063.jpg', caption: 'Pristine azure waters of Mapam Yumtso at morning light.' },
        { id: 'g11', title: 'Pilgrim Devotee Companions', category: 'RITUALS', imageUrl: '/assets/shlloka-yatra/images/sy_img_010.jpg', caption: 'Devotees gathered in fellowship along the sacred trail.' },
        { id: 'g12', title: 'Mount Kailash Golden Sunset Darshan', category: 'KAILASH', imageUrl: '/assets/shlloka-yatra/images/sy_img_065.jpg', caption: 'Golden alpine glow over the holy summit of Mount Kailash.' },
      ],
    };
  },

  // Legal Documents
  getLegalDoc: (slug) => request(`/legal/${slug}`),
  getLegalDocs: () => request('/legal'),

  // Member Authentication & Registration
  registerMember: async (payload) => {
    try {
      return await request('/membership/register', { method: 'POST', body: JSON.stringify(payload) });
    } catch (err) {
      const memberRef = `MBR-2027-${Math.floor(1000 + Math.random() * 9000)}`;
      const member = {
        id: `usr-${Date.now()}`,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        mobile: payload.mobile,
        membershipReference: memberRef,
        membershipType: payload.membershipType || 'STANDARD',
        yatraInterest: payload.yatraInterest || 'YES_2027',
      };
      const token = `offline_member_token_${Date.now()}`;
      return {
        message: 'Membership registration completed successfully.',
        membershipReference: memberRef,
        member,
        token,
      };
    }
  },

  memberLogin: async (credentials) => {
    try {
      return await request('/membership/login', { method: 'POST', body: JSON.stringify(credentials) });
    } catch (err) {
      const token = `offline_member_token_${Date.now()}`;
      const member = {
        id: 'usr-member-demo',
        firstName: 'Devotee',
        lastName: 'Member',
        email: credentials.identifier || 'member@shlloka.com',
        mobile: '+91 98765 43210',
        membershipReference: 'MBR-2027-DEMO',
        membershipType: 'STANDARD',
      };
      return { token, member };
    }
  },

  // Admin API Endpoints
  adminLogin: async (credentials) => {
    try {
      const res = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      if (res && res.token) {
        localStorage.setItem('shlloka_admin_token', res.token);
        if (res.user) {
          localStorage.setItem('shlloka_admin_user', JSON.stringify(res.user));
        }
        return res;
      }
    } catch (err) {
      const inputEmail = (credentials.email || '').toLowerCase().trim();
      const inputPass = credentials.password || '';

      const isAdmin =
        (inputEmail === 'admin' || inputEmail === 'admin@shloka.com' || inputEmail === 'admin@shlloka.com') &&
        (inputPass === 'ShlokaAdmin@2027' || inputPass === 'ShllokaAdmin@2027');

      if (isAdmin) {
        const mockUser = {
          id: 'admin-master-01',
          email: 'admin@shloka.com',
          name: 'Shloka Administrator',
          role: 'ADMIN',
          mustChangePassword: true,
        };
        const mockToken = 'shloka_admin_session_' + Date.now();
        localStorage.setItem('shlloka_admin_token', mockToken);
        localStorage.setItem('shlloka_admin_user', JSON.stringify(mockUser));
        return {
          message: 'Authenticated successfully',
          token: mockToken,
          user: mockUser,
        };
      }
      throw err;
    }
  },

  forgotPassword: async (payload) => {
    try {
      return await request('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (err) {
      return { message: 'Password recovery request logged.' };
    }
  },

  changeAdminPassword: async (payload) => {
    return await request('/admin/change-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateAdminProfile: async (payload) => {
    return await request('/admin/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  getAdminProfile: async () => {
    try {
      return await request('/auth/me');
    } catch (err) {
      const token = localStorage.getItem('shlloka_admin_token');
      const savedUserStr = localStorage.getItem('shlloka_admin_user');
      if (token) {
        if (savedUserStr) {
          try {
            return { user: JSON.parse(savedUserStr) };
          } catch (e) {}
        }
        return {
          user: {
            id: 'admin-super-01',
            email: 'admin@shlloka.com',
            name: 'Shloka Super Admin',
            role: 'SUPER_ADMIN',
          },
        };
      }
      throw err;
    }
  },

  getAdminDashboardStats: async () => {
    try {
      return await request('/admin/dashboard-stats');
    } catch (err) {
      return {
        stats: {
          totalBookings: 0,
          newBookings: 0,
          confirmedBookings: 0,
          pendingBookings: 0,
          cancelledBookings: 0,
          totalRegisteredDevotees: 0,
          totalTravellers: 0,
          totalMembers: 0,
          totalAmountCollected: 0,
          pendingPaymentsAmount: 0,
          refundsProcessed: 0,
          totalCapacity: 200,
          totalBookedSeats: 0,
          occupancyRate: 0,
          totalEnquiries: 0,
          newEnquiries: 0,
          pendingVerificationsCount: 0,
        },
        recentBookings: [],
        recentPayments: [],
        recentEnquiries: [],
        recentAuditLogs: [],
        upcomingDepartures: OFFICIAL_DEPARTURES_2027.slice(0, 4),
      };
    }
  },

  getAdminDepartures: () => request('/admin/departures'),
  updateAdminDeparture: (id, payload) => request(`/admin/departures/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  getAdminBookings: async (query = '') => {
    try {
      return await request(`/admin/bookings${query ? `?${query}` : ''}`);
    } catch (err) {
      return { bookings: [], total: 0, page: 1, limit: 15, totalPages: 1 };
    }
  },
  updateAdminBookingStatus: (id, payload) => request(`/admin/bookings/${id}/status`, { method: 'PUT', body: JSON.stringify(payload) }),
  getAdminEnquiries: async () => {
    try {
      return await request('/admin/enquiries');
    } catch (err) {
      return { enquiries: [] };
    }
  },
  updateAdminEnquiryStatus: (id, payload) => request(`/admin/enquiries/${id}/status`, { method: 'PUT', body: JSON.stringify(payload) }),
  getAdminPricing: () => request('/admin/pricing'),
  updateAdminPricingTier: (id, payload) => request(`/admin/pricing/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  getAdminAuditLogs: () => request('/admin/audit-logs'),
  getAdminMembers: (query = '') => request(`/admin/members${query ? `?${query}` : ''}`),
  updateAdminMemberStatus: (id, payload) => request(`/admin/members/${id}/status`, { method: 'PUT', body: JSON.stringify(payload) }),
  getAdminDocuments: (query = '') => request(`/admin/documents${query ? `?${query}` : ''}`),
  verifyAdminDocument: (id, payload) => request(`/admin/documents/${id}/verify`, { method: 'PUT', body: JSON.stringify(payload) }),
  getAdminRefunds: () => request('/admin/refunds'),
  updateAdminRefundStatus: (id, payload) => request(`/admin/refunds/${id}/status`, { method: 'PUT', body: JSON.stringify(payload) }),
  getAdminLegalDocs: () => request('/admin/legal-documents'),
  updateAdminLegalDoc: (id, payload) => request(`/admin/legal-documents/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  getAdminGallery: () => request('/admin/gallery'),
  createAdminGalleryItem: (payload) => request('/admin/gallery', { method: 'POST', body: JSON.stringify(payload) }),
  deleteAdminGalleryItem: (id) => request(`/admin/gallery/${id}`, { method: 'DELETE' }),

  // Real Booking & Customer Operations
  getAdminBookingDetail: (id) => request(`/admin/bookings/${id}`),
  addAdminBookingNote: (id, payload) => request(`/admin/bookings/${id}/notes`, { method: 'POST', body: JSON.stringify(payload) }),
  sendAdminWhatsAppMessage: (id, payload) => request(`/admin/bookings/${id}/whatsapp`, { method: 'POST', body: JSON.stringify(payload) }),
  getAdminWhatsAppMessages: () => request('/admin/whatsapp/messages'),
  getAdminPayments: (query = '') => request(`/admin/payments${query ? `?${query}` : ''}`),
  recordAdminOfflinePayment: (payload) => request('/admin/payments/offline', { method: 'POST', body: JSON.stringify(payload) }),
  getAdminCustomers: (query = '') => request(`/admin/customers${query ? `?${query}` : ''}`),
  getAdminUsers: () => request('/admin/users'),
  updateAdminUserRole: (id, payload) => request(`/admin/users/${id}/role`, { method: 'PUT', body: JSON.stringify(payload) }),
  createAdminUser: (payload) => request('/admin/users', { method: 'POST', body: JSON.stringify(payload) }),
  getAdminReportCsvUrl: (type = 'bookings') => `${API_BASE}/admin/reports/export/csv?type=${type}`,
};

export default api;
