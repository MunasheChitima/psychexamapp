-- Add missing indexes for user/invitee lookups.
CREATE INDEX "BuddyPair_inviteeUserId_idx" ON "BuddyPair"("inviteeUserId");
CREATE INDEX "ChallengeParticipant_userId_idx" ON "ChallengeParticipant"("userId");
CREATE INDEX "LiveSessionPlayer_userId_idx" ON "LiveSessionPlayer"("userId");
