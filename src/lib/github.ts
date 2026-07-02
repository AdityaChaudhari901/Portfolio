import "server-only";

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export interface ContributionDay {
  date: string;
  count: number;
  level: ContributionLevel;
}

export interface ContributionWeek {
  days: ContributionDay[];
}

export interface ContributionData {
  username: string;
  total: number;
  weeks: ContributionWeek[];
  source: "live" | "mock";
}

const GRAPHQL_ENDPOINT = "https://api.github.com/graphql";

const CONTRIBUTIONS_QUERY = `
  query ($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

const LEVEL_BY_NAME: Record<string, ContributionLevel> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4
};

interface GraphQLDay {
  date: string;
  contributionCount: number;
  contributionLevel: string;
}

interface GraphQLResponse {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions: number;
          weeks: { contributionDays: GraphQLDay[] }[];
        };
      };
    };
  };
  errors?: { message: string }[];
}

/**
 * Fetch a user's public contribution calendar from the GitHub GraphQL API.
 * Falls back to a generated mock grid when no token is set or the request
 * fails, so the page always renders.
 */
export async function getContributions(username: string): Promise<ContributionData> {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return buildMock(username);
  }

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: CONTRIBUTIONS_QUERY,
        variables: { login: username }
      }),
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      return buildMock(username);
    }

    const payload = (await response.json()) as GraphQLResponse;
    const calendar = payload.data?.user?.contributionsCollection?.contributionCalendar;

    if (!calendar) {
      return buildMock(username);
    }

    const weeks: ContributionWeek[] = calendar.weeks.map((week) => ({
      days: week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
        level: LEVEL_BY_NAME[day.contributionLevel] ?? 0
      }))
    }));

    return {
      username,
      total: calendar.totalContributions,
      weeks,
      source: "live"
    };
  } catch {
    return buildMock(username);
  }
}

/** Deterministic pseudo-random grid so the fallback looks plausible and stable. */
function buildMock(username: string): ContributionData {
  const weeks: ContributionWeek[] = [];
  let total = 0;
  let seed = 1337;

  const random = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - 52 * 7 - today.getDay());

  for (let w = 0; w < 53; w += 1) {
    const days: ContributionDay[] = [];
    for (let d = 0; d < 7; d += 1) {
      const date = new Date(start);
      date.setDate(start.getDate() + w * 7 + d);
      if (date > today) continue;

      const roll = random();
      const level: ContributionLevel =
        roll > 0.82 ? 4 : roll > 0.66 ? 3 : roll > 0.44 ? 2 : roll > 0.24 ? 1 : 0;
      const count = level === 0 ? 0 : level * 2 + Math.floor(random() * 4);
      total += count;

      days.push({ date: date.toISOString().slice(0, 10), count, level });
    }
    weeks.push({ days });
  }

  return { username, total, weeks, source: "mock" };
}
