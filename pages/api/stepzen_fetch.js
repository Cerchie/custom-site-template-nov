// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function getData(req, res) {
  let envVars = Object.entries(process.env).filter((key) =>
    key[0].startsWith("NEXT_")
  );

  const username = envVars[0][1];

  const nameIndex = envVars.findIndex(
    (val) => val[0] === "NEXT_DEVTO_USERNAME"
  );

  if (nameIndex !== -1) {
    envVars.splice(nameIndex, 1);
  }

  let github_token = process.env.NEXT_GITHUB_TOKEN;
  let twitter_bearerToken = process.env.NEXT_TWITTER_BEARER_TOKEN;

  const response = await fetch(
    "https://graphql1f.steprz.net/api/1fec739d90f6028c74a6f19855c34277/__graphql",

    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        query: `query MyQuery ($github_token: Secret! $twitter_bearerToken: Secret!, $username: String! ) {
        devto_getArticles(username: $username, top: 3) {
          title
          published_at
          user {
            github_details(github_token: $github_token) {
              pinnedItems(first: 3) {
                nodes {
                  ... on Github_Repository {
                    id
                    name
                    description
                  
                  }
                }
              }
            }
        
            twitter_details(
              twitter_bearerToken: $twitter_bearerToken
            ) {
              pinned_tweet(
                twitter_bearerToken: $twitter_bearerToken
              ) {
                text
              }
            }
            github_username
        
          }
        }
      } 
      `,
        variables: {
          github_token: github_token,
          twitter_bearerToken: twitter_bearerToken,
          username: username,
        },
      }),
    }
  );
  // .then((response) => response.json())
  // .then((data) => console.log("RESPOSE DATA FROM API", data))
  // .then((data) => data);
  let data = await response.json();
  console.log("data in api", data);
  return res.status(200).json({ data: data });
}
