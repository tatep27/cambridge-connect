import { prisma } from '../lib/prisma';
import { prismaOrgToTypeScript, prismaForumToTypeScript } from '../lib/db-transformers';

async function verifySeed() {
  console.log('Verifying database seed...\n');

  // Check organizations
  const orgs = await prisma.organization.findMany();
  console.log(`✅ Organizations: ${orgs.length} found`);
  if (orgs.length > 0) {
    const firstOrg = prismaOrgToTypeScript(orgs[0]);
    console.log(`   Example: ${firstOrg.name} (${firstOrg.type.join(', ')})`);
  }

  // Check forums
  const forums = await prisma.forum.findMany();
  console.log(`✅ Forums: ${forums.length} found`);
  if (forums.length > 0) {
    const firstForum = prismaForumToTypeScript(forums[0]);
    console.log(`   Example: ${firstForum.title} (${firstForum.category})`);
  }

  // Check posts
  const posts = await prisma.forumPost.findMany();
  console.log(`✅ Posts: ${posts.length} found`);
  if (posts.length > 0) {
    console.log(`   Example: "${posts[0].title}"`);
  }

  // Check replies
  const replies = await prisma.forumReply.findMany();
  console.log(`✅ Replies: ${replies.length} found`);

  // Check relationships
  const forumWithPosts = await prisma.forum.findFirst({
    include: { posts: true },
  });
  if (forumWithPosts) {
    console.log(`✅ Relationships: Forum "${forumWithPosts.title}" has ${forumWithPosts.posts.length} posts`);
  }

  const postWithReplies = await prisma.forumPost.findFirst({
    include: { replies: true },
  });
  if (postWithReplies) {
    console.log(`✅ Relationships: Post "${postWithReplies.title}" has ${postWithReplies.replies.length} replies`);
  }

  await prisma.$disconnect();
  console.log('\n✨ Verification complete!');
}

verifySeed().catch(console.error);

