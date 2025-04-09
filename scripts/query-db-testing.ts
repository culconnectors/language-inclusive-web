import { PrismaClient as PrismaCommunity } from '@prisma/client-community';
import { PrismaClient as PrismaEnglish } from '@prisma/client-workshop';

// Initialize the clients
const communityClient = new PrismaCommunity();
const englishClient = new PrismaEnglish();

// Function to find all community-friendly events
async function findCommunityFriendlyEvents() {
  try {
    const communityFriendlyEvents = await communityClient.event.findMany({
      where: {
        predicted_community_friendly: true,
        venue: {
          venue_city: "Ballarat Central"
        }
      },
      include: {
        category: true,
        venue: true,
        organizer: true
      }
    });
    console.log('Community Friendly Events:', communityFriendlyEvents);
  } finally {
    await communityClient.$disconnect();
  }
}

// Function to find upcoming events
async function findUpcomingEvents() {
  try {
    const upcomingEvents = await communityClient.event.findMany({
      where: {
        start_datetime: {
          gt: new Date()
        }
      },
      orderBy: {
        start_datetime: 'asc'
      },
      take: 10
    });
    console.log('Upcoming Events:', upcomingEvents);
  } finally {
    await communityClient.$disconnect();
  }
}

// Function to find English courses
async function findEnglishCourses() {
  try {
    const englishCourses = await englishClient.course.findMany({
      where: {
        is_english_course: true
      },
      include: {
        provider: true
      }
    });
    console.log('English Courses:', englishCourses);
  } finally {
    await englishClient.$disconnect();
  }
}

// Select which query to run via command line argument
const queryName = process.argv[2];

async function main() {
  switch (queryName) {
    case 'community-friendly':
      await findCommunityFriendlyEvents();
      break;
    case 'upcoming':
      await findUpcomingEvents();
      break;
    case 'english-courses':
      await findEnglishCourses();
      break;
    default:
      console.log('Please specify a query name: community-friendly, upcoming, or english-courses');
      console.log('Example: npx ts-node prisma-queries.ts community-friendly');
      break;
  }
}

main()
  .then(() => console.log('Query completed successfully'))
  .catch((error) => console.error('Error running query:', error));