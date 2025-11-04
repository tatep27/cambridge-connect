/**
 * Prisma Database Seed Script
 * 
 * Seeds the database with mock data from lib/data/
 * This script is idempotent - can be run multiple times safely
 */

import { prisma } from '../lib/prisma';
import { mockOrganizations } from '../lib/data/mockOrganizations';
import { mockForums, mockPosts, mockReplies } from '../lib/data/mockForums';
import { typeScriptOrgToPrisma } from '../lib/db-transformers';
import { parseDateFromApi } from '../lib/db-helpers';

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data (idempotent - safe to run multiple times)
  console.log('Clearing existing data...');
  await prisma.forumReply.deleteMany();
  await prisma.forumPost.deleteMany();
  await prisma.forum.deleteMany();
  await prisma.organization.deleteMany();

  // Seed Organizations
  console.log(`Seeding ${mockOrganizations.length} organizations...`);
  for (const org of mockOrganizations) {
    await prisma.organization.create({
      data: typeScriptOrgToPrisma(org),
    });
  }
  console.log('✅ Organizations seeded');

  // Seed Forums
  console.log(`Seeding ${mockForums.length} forums...`);
  for (const forum of mockForums) {
    await prisma.forum.create({
      data: {
        id: forum.id,
        title: forum.title,
        category: forum.category,
        description: forum.description,
        createdAt: parseDateFromApi(forum.createdAt),
        postCount: forum.postCount,
        lastActivity: parseDateFromApi(forum.lastActivity),
        memberCount: forum.memberCount,
        messagesToday: forum.messagesToday,
      },
    });
  }
  console.log('✅ Forums seeded');

  // Seed Posts
  console.log(`Seeding ${mockPosts.length} posts...`);
  for (const post of mockPosts) {
    await prisma.forumPost.create({
      data: {
        id: post.id,
        forumId: post.forumId,
        authorOrgId: post.authorOrgId,
        authorOrgName: post.authorOrgName,
        title: post.title,
        content: post.content,
        createdAt: parseDateFromApi(post.createdAt),
        updatedAt: post.updatedAt ? parseDateFromApi(post.updatedAt) : null,
        replyCount: post.replyCount,
      },
    });
  }
  console.log('✅ Posts seeded');

  // Seed Replies
  console.log(`Seeding ${mockReplies.length} replies...`);
  for (const reply of mockReplies) {
    await prisma.forumReply.create({
      data: {
        id: reply.id,
        postId: reply.postId,
        authorOrgId: reply.authorOrgId,
        authorOrgName: reply.authorOrgName,
        content: reply.content,
        createdAt: parseDateFromApi(reply.createdAt),
      },
    });
  }
  console.log('✅ Replies seeded');

  // Verify data
  const orgCount = await prisma.organization.count();
  const forumCount = await prisma.forum.count();
  const postCount = await prisma.forumPost.count();
  const replyCount = await prisma.forumReply.count();

  console.log('\n📊 Database Summary:');
  console.log(`   Organizations: ${orgCount}`);
  console.log(`   Forums: ${forumCount}`);
  console.log(`   Posts: ${postCount}`);
  console.log(`   Replies: ${replyCount}`);

  console.log('\n✨ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

