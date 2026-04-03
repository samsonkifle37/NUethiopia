import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-black text-[#1A1612] mb-2">Invalid Request</h1>
        <p className="text-gray-500 mb-6 font-medium">No verification token was provided.</p>
        <Link href="/" className="px-6 py-3 bg-[#C9973B] text-white rounded-xl font-bold">Go Home</Link>
      </div>
    );
  }

  // Find valid token
  const verificationRecord = await prisma.verificationToken.findUnique({
    where: { token },
    include: { user: true }
  });

  if (!verificationRecord) {
     return (
      <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-black text-[#1A1612] mb-2">Invalid or Expired Link</h1>
        <p className="text-gray-500 mb-6 font-medium">This verification link is invalid or has already been used.</p>
        <Link href="/auth" className="px-6 py-3 bg-[#C9973B] text-white rounded-xl font-bold">Log In</Link>
      </div>
    );
  }

  if (verificationRecord.expiresAt < new Date()) {
     // Clean up expired token
     await prisma.verificationToken.delete({ where: { id: verificationRecord.id } });
     return (
      <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-black text-[#1A1612] mb-2">Link Expired</h1>
        <p className="text-gray-500 mb-6 font-medium">This verification link has expired. Please request a new one.</p>
        <Link href="/auth" className="px-6 py-3 bg-[#C9973B] text-white rounded-xl font-bold">Log In</Link>
      </div>
    );
  }

  // All good! Verify user...
  await prisma.$transaction(async (tx) => {
    // 1. Mark user as verified
    await tx.user.update({
      where: { id: verificationRecord.userId },
      data: { isEmailVerified: true }
    });

    // 2. Delete token securely
    await tx.verificationToken.delete({
      where: { id: verificationRecord.id }
    });

    // 3. Log event
    await tx.notificationLog.create({
      data: {
         type: "EMAIL_VERIFIED",
         userId: verificationRecord.userId,
         message: "User successfully verified their email."
      }
    });
  });

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
        {/* Checkmark icon equivalent */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
      <h1 className="text-2xl font-black text-[#1A1612] mb-2">Email Verified Successfully!</h1>
      <p className="text-gray-500 mb-6 font-medium">Your account is now verified. You can now access your STAYS dashboard and publish listings.</p>
      
      <div className="flex gap-4">
        <Link href="/profile" className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50">Go to Profile</Link>
        <Link href="/" className="px-6 py-3 bg-[#1A1612] text-white rounded-xl font-bold hover:bg-black">Explore NU</Link>
      </div>
    </div>
  );
}
