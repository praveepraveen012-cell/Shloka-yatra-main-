import prisma from '../server/src/prisma.js';

async function cleanup() {
  console.log('--- STARTING DEMO DATA PURGE ---');

  const PRAVEEN_MEMBER_ID = '8329c3b0-bdbf-4bad-94ac-619735ec5e6d';
  const PRAVEEN_BOOKING_ID = '56da6ec8-cfd2-456a-9f47-4bdc9e57209a';
  const PRAVEEN_EMAIL = 'grexotixpraveen@gmail.com';

  // 1. Clean Payments
  const deletedPayments = await prisma.payment.deleteMany({
    where: {
      bookingId: { not: PRAVEEN_BOOKING_ID }
    }
  });
  console.log(`Deleted ${deletedPayments.count} demo payments.`);

  // 2. Clean Refunds
  const deletedRefunds = await prisma.refund.deleteMany({
    where: {
      bookingId: { not: PRAVEEN_BOOKING_ID }
    }
  });
  console.log(`Deleted ${deletedRefunds.count} demo refunds.`);

  // 3. Clean Document Submissions & Reviews
  const deletedReviews = await prisma.documentReview.deleteMany({
    where: {
      submission: {
        bookingId: { not: PRAVEEN_BOOKING_ID }
      }
    }
  });
  console.log(`Deleted ${deletedReviews.count} demo document reviews.`);

  const deletedSubmissions = await prisma.documentSubmission.deleteMany({
    where: {
      bookingId: { not: PRAVEEN_BOOKING_ID }
    }
  });
  console.log(`Deleted ${deletedSubmissions.count} demo document submissions.`);

  // 4. Clean Uploaded Documents
  const deletedDocs = await prisma.uploadedDocument.deleteMany({
    where: {
      bookingId: { not: PRAVEEN_BOOKING_ID }
    }
  });
  console.log(`Deleted ${deletedDocs.count} demo uploaded documents.`);

  // 5. Clean WhatsApp Messages
  const deletedWhatsApp = await prisma.whatsAppMessage.deleteMany({
    where: {
      bookingId: { not: PRAVEEN_BOOKING_ID }
    }
  });
  console.log(`Deleted ${deletedWhatsApp.count} demo WhatsApp messages.`);

  // 6. Clean Booking Notes
  const deletedNotes = await prisma.bookingNote.deleteMany({
    where: {
      bookingId: { not: PRAVEEN_BOOKING_ID }
    }
  });
  console.log(`Deleted ${deletedNotes.count} demo booking notes.`);

  // 7. Clean Consent Records
  const deletedConsents = await prisma.consentRecord.deleteMany({
    where: {
      bookingId: { not: PRAVEEN_BOOKING_ID }
    }
  });
  console.log(`Deleted ${deletedConsents.count} demo consent records.`);

  // 8. Clean Travellers
  const deletedTravellers = await prisma.traveller.deleteMany({
    where: {
      bookingId: { not: PRAVEEN_BOOKING_ID }
    }
  });
  console.log(`Deleted ${deletedTravellers.count} demo travellers.`);

  // 9. Clean Bookings
  const deletedBookings = await prisma.booking.deleteMany({
    where: {
      id: { not: PRAVEEN_BOOKING_ID }
    }
  });
  console.log(`Deleted ${deletedBookings.count} demo bookings. Preserved booking for Praveen.A.`);

  // 10. Clean Member OTPs
  const deletedOtps = await prisma.memberOtp.deleteMany({
    where: {
      memberId: { not: PRAVEEN_MEMBER_ID }
    }
  });
  console.log(`Deleted ${deletedOtps.count} demo member OTPs.`);

  // 11. Clean Members
  const deletedMembers = await prisma.member.deleteMany({
    where: {
      id: { not: PRAVEEN_MEMBER_ID }
    }
  });
  console.log(`Deleted ${deletedMembers.count} demo members. Preserved member Praveen.A.`);

  // 12. Clean Test Departures (Keep only official Batches 1 to 8)
  const deletedDepartures = await prisma.departure.deleteMany({
    where: {
      batchNumber: { gt: 8 }
    }
  });
  console.log(`Deleted ${deletedDepartures.count} test departures. Only official Batches 1-8 remain.`);

  // 13. Reset official departure batch occupancies
  // Praveen.A is in Batch 1 (May Batch — Full Moon)
  await prisma.departure.updateMany({
    where: { batchNumber: 1 },
    data: { bookedSeats: 1, totalCapacity: 25, status: 'AVAILABLE' }
  });
  await prisma.departure.updateMany({
    where: { batchNumber: { in: [2, 3, 4, 5, 6, 7, 8] } },
    data: { bookedSeats: 0, totalCapacity: 25, status: 'AVAILABLE' }
  });
  console.log('Reset official departure occupancies (Batch 1 has 1 seat for Praveen.A, Batches 2-8 have 0).');

  // 14. Clean Enquiries
  const deletedEnquiries = await prisma.enquiry.deleteMany({});
  console.log(`Deleted ${deletedEnquiries.count} test enquiries.`);

  // 15. Clean Support Tickets
  const deletedTickets = await prisma.supportTicket.deleteMany({});
  console.log(`Deleted ${deletedTickets.count} test support tickets.`);

  // 16. Clean Audit Logs (except those associated with Praveen or Admins)
  const deletedAudit = await prisma.auditLog.deleteMany({
    where: {
      AND: [
        { userEmail: { not: 'admin@shloka.com' } },
        { userEmail: { not: 'admin@shlloka.com' } },
        { userEmail: { not: PRAVEEN_EMAIL } },
        { details: { not: { contains: 'praveen' } } },
        { details: { not: { contains: PRAVEEN_BOOKING_ID } } },
      ]
    }
  });
  console.log(`Deleted ${deletedAudit.count} test audit logs.`);

  console.log('\n--- VERIFICATION OF PURGED DATABASE ---');
  const remainingMembers = await prisma.member.findMany();
  console.log(`Members remaining: ${remainingMembers.length}`);
  remainingMembers.forEach(m => console.log(` - ${m.firstName} ${m.lastName} (${m.email}, ${m.membershipReference})`));

  const remainingBookings = await prisma.booking.findMany({
    include: { travellers: true, departure: true, route: true }
  });
  console.log(`Bookings remaining: ${remainingBookings.length}`);
  remainingBookings.forEach(b => console.log(` - Ref: ${b.bookingReference}, Contact: ${b.contactName} (${b.contactEmail}), Batch: ${b.departure?.name}, Yatris: ${b.travellers.length}`));

  const remainingDepartures = await prisma.departure.findMany({
    orderBy: { batchNumber: 'asc' }
  });
  console.log(`Departures remaining: ${remainingDepartures.length}`);
  remainingDepartures.forEach(d => console.log(` - Batch ${d.batchNumber}: ${d.name} (${d.bookedSeats}/${d.totalCapacity} booked)`));

  const remainingPayments = await prisma.payment.findMany();
  console.log(`Payments remaining: ${remainingPayments.length}`);

  const remainingEnquiries = await prisma.enquiry.findMany();
  console.log(`Enquiries remaining: ${remainingEnquiries.length}`);

  console.log('--- DEMO DATA PURGE COMPLETED SUCCESSFULLY ---');
}

cleanup()
  .catch(err => {
    console.error('Error during cleanup:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
