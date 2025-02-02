# Hashnode Blog Posts

This document tracks the blog posts that need to be uploaded to Hashnode.

## Trade Categories

Each blog post should be tagged with the appropriate trade category:

- bathroom-remodeling
- decks
- electrician
- epoxy-garage
- fencing
- flooring
- home-remodeling
- hvac
- kitchen-remodeling
- landscaping
- masonry
- painting
- plumbing
- roofing
- siding
- windows

## Post Format

When creating posts on Hashnode, follow this format:

```markdown
---
title: [Post Title]
subtitle: [Brief Description]
tags: [trade-category]
cover: [Image URL if applicable]
---

[Post Content]
```

## Posts to Upload

1. [ ] Post Title: 
   - Category: 
   - Status: Not uploaded
   - Notes: 

2. [ ] Post Title: 
   - Category: 
   - Status: Not uploaded
   - Notes: 

## Instructions

1. Create a Hashnode account if not already done
2. Set up a team blog with the domain: topcontractorsdenver.hashnode.dev
3. For each post:
   - Create a new article
   - Copy content from existing Ghost blog
   - Add appropriate trade category tag
   - Add any relevant images
   - Preview and publish
   - Check off in this document once uploaded

## API Integration

Once posts are uploaded, they will be accessible via the Hashnode API using:
- API Key: `a8de46a0-8cdd-4ad4-b793-83d67c1cf7c6`
- Host: `topcontractorsdenver.hashnode.dev`

## Notes

- Ensure all posts maintain proper formatting when copying from Ghost
- Keep track of the upload status in this document
- Add any issues or special considerations in the Notes section


Hashnode Public API Docs
Welcome
This document describes the Hashnode Public API. The Hashnode Public API is a GraphQL API that allows you to interact with Hashnode.

Make sure to join our Discord server to be in the loop about any updates.

If you're seeing Errors with a 502 status code, it's highly likely that you are using api.hashnode.com. This was our legacy API and is now officially discontinued. Please use these docs and the migration guide to transition to our new GQL API.

GQL Playground
All Hashnode Public API queries are made through a single GraphQL endpoint, which only accepts POST requests.

https://gql.hashnode.com

You can visit the same URL to check out Hashnode API Playground.

Hashnode API Playground

You can query user details, publication information, posts within publications, drafts, and more. Please explore the playground to view all available fields.

Additionally, mutations are at your disposal for actions such as publishing posts, subscribing to newsletters, and following users. The complete list of these available mutations can be found within the playground.

If you're not familiar with GraphQL, be sure to check out this beginner-friendly guide on freeCodeCamp

Caching
Almost all responses of queries are cached on the Edge. Cached data will automatically be purged if you mutate the data. For example, if you request a post of your blog:

Cache Example

The playground shows you if a response is cached or not. You can see it in the bottom right corner (MISS or HIT).

🚧 Important: You need to request the field id of each field. It is best practice to always request the id. If you don't do that it is possible that you get stale data.

Rate Limits
We have a very generous rate limit in place which are as follows:

Query users are allowed to send up to 20k requests per minute.
Mutations users can send up to 500 requests per per minute.
Authentication
Almost all queries can be accessed without any authentication mechanism. Some sensitive fields need authentication. All mutations need an authentication header.

You can include an Authorization header in your request to access restricted fields. The value of the Authorization header needs to be your Personal Access Token (PAT).

You can test it in the GQL playground and click on the Headers tab to add the header.

Header

To generate the token, go to https://hashnode.com/settings/developer and click on "Generate New Token".

Developer Settings

Once the token is generated, simply pass it as Authorization header.

An example of a restricted query could be getting drafts inside any blog, it can only be queried by their respective owners.

query Publication($first: Int!, $host: String) {
    publication(host: $host) {
        drafts(first: $first) {
            edges {
                node {
                    title
                }
            }
        }
    }
}
Similarly, anyone can request user details but certain fields like unsubscribeCode and email require an authorization header to be present.

Please ensure that you pass the token when requesting restricted fields; otherwise, the API will throw an error.

Status and Error Codes
GraphQL APIs use HTTP status codes to indicate the success or failure of a request. A 200 OK status code means the request was successful. In addition to HTTP status codes, GraphQL APIs also return error objects in response to specific errors.

These error objects have a code and message property. The code is a string that identifies the type of error. For example, you'll receive something like this if you try to request restricted fields without passing the authorization header.

{
    "errors": [
        {
            "message": "You must be authenticated.",
            "locations": [
                {
                    "line": 2,
                    "column": 3
                }
            ],
            "path": ["me"],
            "extensions": {
                "code": "UNAUTHENTICATED"
            }
        }
    ],
    "data": null
}
Some of the error codes are:

GRAPHQL_VALIDATION_FAILED
UNAUTHENTICATED
FORBIDDEN
BAD_USER_INPUT
NOT_FOUND
You can check out this article to understand error codes in detail.

You must check for the presence of error objects along with error codes and messages to handle GraphQL errors in a structured way.

Pagination
When handling extensive lists of items in an API, such as many blog posts, it's practical to fetch them in smaller sets rather than all at once. This process is known as pagination. For instance, if your blog has 500 posts, retrieving them all simultaneously can be inefficient. A better approach is to initially fetch a subset, like 10 posts, and then continue loading more in small groups.

Hashnode offers two distinct pagination methods, each suited for different scenarios:

Cursor-Based Pagination
Offset-Based Pagination
Only one type of pagination is available for a query. You can distinguish the types of the type of response connection that is available. For cursor-based pagination the type PageInfo is available. For offset-based pagination the type OffsetPageInfo is available.

1. Cursor-Based Pagination
Cursor-based pagination is ideal for an infinite scrolling mechanism, where there is no fixed concept of pages. It uses a field named endCursor to keep track of the last item fetched. This cursor is then used to request subsequent items.

In this approach, the first API request does not include a cursor, and the API responds with the first set of results along with a new cursor. This new cursor is then utilized to fetch the next set of results.

Example Query in GraphQL
query Publication {
    publication(host: "blog.developerdao.com") {
        isTeam
        title
        posts(
            first: 10
            after: "NjQxZTc4NGY0M2NiMzc2YjAyNzNkMzU4XzIwMjMtMDMtMjVUMDQ6Mjc6NTkuNjQxWg=="
        ) {
            edges {
                node {
                    title
                    brief
                    url
                }
            }
            pageInfo {
                endCursor
                hasNextPage
            }
        }
    }
}
In this example, edges contains a list of nodes (the data), and the pageInfo object provides pagination details. Use pageInfo.hasNextPage to check for more data and pageInfo.endCursor for subsequent requests.

For more information, visit Relay Pagination Specification.

2. Offset-Based Pagination
Offset-based pagination is more traditional, involving distinct pages. It is suitable when you want to display data on specific pages or embed page information in URLs.

Example Query in GraphQL
query Followers {
    user(username: "SandroVolpicella") {
        id
        followers(pageSize: 10, page: 1) {
            pageInfo {
                hasNextPage
                hasPreviousPage
                previousPage
                nextPage
            }
        }
    }
}
In this method, pageInfo includes information about the availability of next and previous pages, allowing for easy navigation between different sets of data.

Breaking Changes
Breaking changes, while rare, can occur. Our aim is to minimize them. Stay updated by joining our Discord server.

When a breaking change is imminent, rest assured, we'll notify you beforehand. Affected fields, queries, or mutations will be deprecated in advance, ensuring you're well-prepared for the upcoming change.

Thank you for your understanding and collaboration.

Legacy API Migration
Overview
After the deprecation phase, our old legacy GraphQL API is now shutdown. To ensure that your apps are still working, follow this migration guide from the old API to the new API (gql.hashnode.com).

Migration Steps
Update API Endpoint
Replace the old API endpoint https://api.hashnode.com with the new GraphQL endpoint https://gql.hashnode.com.

Authentication Changes
If you were using authentication for the old API, ensure that your authentication mechanism remains valid for the new API. Check the documentation for how Authentication works in our GraphQL API.

Adjust Queries
Review your existing GraphQL queries and mutations. Some types and fields may have changed. Refer to the documentation for Examples and below to review the latest schema, query and mutation definitions.

Check Pagination
If your application relies on pagination, ensure that you are using the updated pagination methods provided by the new API. We offer two kinds of pagination: Cursor-Based Pagination and Offset-Based Pagination. Review the pagination guide in the docs on how these two are working.

Update Error Handling
The new API might have different error responses or codes. Update your error handling mechanisms to accommodate any changes in error formats. You can check out this article to understand error codes in detail.

Counts
If you want to access a count of some entity we provide them via the field totalDocuments on the connection of the attribute.

Let's see an example:

query SeriesCount {
    publication(host: "engineering.hashnode.com") {
        seriesList(first: 0) {
            totalDocuments
        }
    }
}
The result looks like that:

{
    "data": {
        "publication": {
            "seriesList": {
                "totalDocuments": 3
            }
        }
    }
}
The field totalDocuments shows you how many series are in the publication with the host engineering.hashnode.com. The totalDocuments field doesn't refer to how many items you request with first. This is independent of each other.

We don't expose this field for all connections, but for most of them.

Examples
Let’s look at some examples which might help you get started:

Fetch details about your publication
query Publication {
    publication(host: "blog.developerdao.com") {
        isTeam
        title
        about {
            markdown
        }
    }
}
Fetch posts from your blog
query Publication {
    publication(host: "blog.developerdao.com") {
        isTeam
        title
        posts(first: 10) {
            edges {
                node {
                    title
                    brief
                    url
                }
            }
        }
    }
}
The queries support pagination, and let you fetch a full list of the posts to recreate your blog home page.

Fetch a single article (blog post)
query Publication {
    publication(host: "blog.developerdao.com") {
        isTeam
        title
        post(slug: "the-developers-guide-to-chainlink-vrf-foundry-edition") {
            title
            content {
                markdown
                html
            }
        }
    }
}
As long as you have your publication hostname and article slug, you can fetch it like the above.

Fetch posts from a series
query Publication {
    publication(host: "lo-victoria.com") {
        isTeam
        title
        series(slug: "graphql") {
            posts(first: 10) {
                edges {
                    node {
                        title
                    }
                }
            }
        }
    }
}
Fetch static pages
query Publication {
    publication(host: "lo-victoria.com") {
        isTeam
        title
        staticPages(first: 10) {
            edges {
                node {
                    title
                    slug
                }
            }
        }
    }
}
Fetch a single page
query Publication {
    publication(host: "lo-victoria.com") {
        isTeam
        title
        staticPage(slug: "about") {
            title
            content {
                markdown
            }
        }
    }
}
Queries
checkCustomDomainAvailability
Response
Returns a CheckCustomDomainAvailabilityResult!

Arguments
Name	Description
input - CheckCustomDomainAvailabilityInput!	
Example
Query
query CheckCustomDomainAvailability($input: CheckCustomDomainAvailabilityInput!) {
  checkCustomDomainAvailability(input: $input) {
    domainAvailable
  }
}
Variables
{"input": CheckCustomDomainAvailabilityInput}
Response
{"data": {"checkCustomDomainAvailability": {"domainAvailable": false}}}
Queries
checkSubdomainAvailability
Response
Returns a CheckSubdomainAvailabilityResult!

Arguments
Name	Description
subdomain - String!	
Example
Query
query CheckSubdomainAvailability($subdomain: String!) {
  checkSubdomainAvailability(subdomain: $subdomain) {
    subdomainAvailable
  }
}
Variables
{"subdomain": "xyz789"}
Response
{"data": {"checkSubdomainAvailability": {"subdomainAvailable": true}}}
Queries
documentationProject
Response
Returns a DocumentationProject

Arguments
Name	Description
id - ID	
host - String	
Example
Query
query DocumentationProject(
  $id: ID,
  $host: String
) {
  documentationProject(
    id: $id,
    host: $host
  ) {
    id
    domain {
      hashnodeSubDomain
      customDomain {
        ...DocumentationProjectCustomDomainFragment
      }
    }
    name
    description
    settings {
      isRobotsAllowed
      isHashnodeLoginAllowed
      isHeadless
    }
    links {
      twitter
      instagram
      github
      website
      hashnode
      youtube
      dailydev
      linkedin
      mastodon
      githubRepository
      bluesky
    }
    publishedGuides {
      ... on DocumentationGuide {
        ...DocumentationGuideFragment
      }
      ... on DocumentationApiReference {
        ...DocumentationApiReferenceFragment
      }
    }
    guides {
      ... on DocumentationGuide {
        ...DocumentationGuideFragment
      }
      ... on DocumentationApiReference {
        ...DocumentationApiReferenceFragment
      }
    }
    analytics {
      views {
        ...ProjectViewsConnectionFragment
      }
      visitors {
        ...ProjectVisitorsConnectionFragment
      }
    }
    members {
      user {
        ...UserFragment
      }
      role
    }
    membersV2 {
      nodes {
        ...DocumentationProjectMemberV2Fragment
      }
      pageInfo {
        ...OffsetPageInfoFragment
      }
      totalDocuments
    }
    createdAt
    updatedAt
    guide {
      ... on DocumentationGuide {
        ...DocumentationGuideFragment
      }
      ... on DocumentationApiReference {
        ...DocumentationApiReferenceFragment
      }
    }
    publishedGuide {
      ... on DocumentationGuide {
        ...DocumentationGuideFragment
      }
      ... on DocumentationApiReference {
        ...DocumentationApiReferenceFragment
      }
    }
    defaultGuide {
      ... on DocumentationGuide {
        ...DocumentationGuideFragment
      }
      ... on DocumentationApiReference {
        ...DocumentationApiReferenceFragment
      }
    }
    customPage {
      id
      title
      slug
      content {
        ...DocumentationPageContentFragment
      }
      ogMetaData {
        ...OpenGraphMetaDataFragment
      }
      seo {
        ...SEOFragment
      }
      lastModified
      visibility
    }
    customPages {
      nodes {
        ...DocsCustomPageFragment
      }
      pageInfo {
        ...OffsetPageInfoFragment
      }
      totalDocuments
    }
    appearance {
      logoUrl
      logoDarkThemeUrl
      favIconUrl
      primaryColor
      defaultDocsTheme
      getStarted {
        ...DocumentationProjectGetStartedFragment
      }
      customScript
    }
    integrations {
      fbPixelID
      hotjarSiteID
      gaTrackingID
      gTagManagerID
      intercomID
      metaTags
      koalaPublicKey
      msClarityID
    }
    features {
      collaboration {
        ...CollaborationFeatureFragment
      }
      ghSync {
        ...GitHubSyncFeatureFragment
      }
      versioning {
        ...VersioningFeatureFragment
      }
    }
    url
    navigation {
      header {
        ... on DocumentationNavbarItemLink {
          ...DocumentationNavbarItemLinkFragment
        }
        ... on DocumentationNavbarItemGuide {
          ...DocumentationNavbarItemGuideFragment
        }
        ... on DocumentationNavbarItemPage {
          ...DocumentationNavbarItemPageFragment
        }
      }
      footer {
        ...DocumentationNavbarColumnFragment
      }
    }
    searchUsers {
      nodes {
        ...UserFragment
      }
      edges {
        ...DocumentationProjectSearchUserEdgeFragment
      }
      pageInfo {
        ...OffsetPageInfoFragment
      }
      totalDocuments
    }
    pendingInvites {
      nodes {
        ...DocumentationProjectInviteFragment
      }
      pageInfo {
        ...OffsetPageInfoFragment
      }
      totalDocuments
    }
    owner {
      id
      username
      name
      bio {
        ...ContentFragment
      }
      bioV2 {
        ...ContentFragment
      }
      profilePicture
      socialMediaLinks {
        ...SocialMediaLinksFragment
      }
      badges {
        ...BadgeFragment
      }
      publications {
        ...UserPublicationsConnectionFragment
      }
      posts {
        ...UserPostConnectionFragment
      }
      followersCount
      followingsCount
      tagline
      dateJoined
      location
      availableFor
      tagsFollowing {
        ...TagFragment
      }
      ambassador
      deactivated
      following
      followsBack
      followers {
        ...UserConnectionFragment
      }
      follows {
        ...UserConnectionFragment
      }
      techStack {
        ...UserTagsConnectionFragment
      }
    }
    subscription {
      status
      productName
      nextBillingCycle
      maxSeats
    }
    ai {
      prompts {
        ...DocumentationProjectAIPromptFragment
      }
      settings {
        ...DocumentationProjectAISettingsFragment
      }
    }
  }
}
Variables
{
  "id": "4",
  "host": "xyz789"
}
Response
{
  "data": {
    "documentationProject": {
      "id": "4",
      "domain": DocumentationProjectDomainSettings,
      "name": "xyz789",
      "description": "xyz789",
      "settings": DocumentationProjectSettings,
      "links": DocumentationProjectLinks,
      "publishedGuides": [DocumentationGuide],
      "guides": [DocumentationGuide],
      "analytics": DocumentationProjectAnalytics,
      "members": [DocumentationProjectMember],
      "membersV2": DocumentationProjectMemberConnection,
      "createdAt": "2007-12-03T10:15:30Z",
      "updatedAt": "2007-12-03T10:15:30Z",
      "guide": DocumentationGuide,
      "publishedGuide": DocumentationGuide,
      "defaultGuide": DocumentationGuide,
      "customPage": DocsCustomPage,
      "customPages": DocsCustomPageConnection,
      "appearance": DocumentationProjectAppearance,
      "integrations": DocumentationProjectIntegrations,
      "features": DocumentationProjectFeatures,
      "url": "xyz789",
      "navigation": DocumentationProjectNavigation,
      "searchUsers": DocumentationProjectSearchUserConnection,
      "pendingInvites": DocumentationProjectPendingInviteConnection,
      "owner": User,
      "subscription": DocumentationProjectSubscription,
      "ai": DocumentationProjectAIPreference
    }
  }
}
Queries
draft
Description
Returns a draft by ID. Draft is a post that is not published yet.

Response
Returns a Draft

Arguments
Name	Description
id - ObjectId!	The ID of the draft to retrieve.
Example
Query
query Draft($id: ObjectId!) {
  draft(id: $id) {
    id
    slug
    title
    subtitle
    author {
      id
      username
      name
      bio {
        ...ContentFragment
      }
      bioV2 {
        ...ContentFragment
      }
      profilePicture
      socialMediaLinks {
        ...SocialMediaLinksFragment
      }
      badges {
        ...BadgeFragment
      }
      publications {
        ...UserPublicationsConnectionFragment
      }
      posts {
        ...UserPostConnectionFragment
      }
      followersCount
      followingsCount
      tagline
      dateJoined
      location
      availableFor
      tagsFollowing {
        ...TagFragment
      }
      ambassador
      deactivated
      following
      followsBack
      followers {
        ...UserConnectionFragment
      }
      follows {
        ...UserConnectionFragment
      }
      techStack {
        ...UserTagsConnectionFragment
      }
    }
    coAuthors {
      id
      username
      name
      bio {
        ...ContentFragment
      }
      bioV2 {
        ...ContentFragment
      }
      profilePicture
      socialMediaLinks {
        ...SocialMediaLinksFragment
      }
      badges {
        ...BadgeFragment
      }
      publications {
        ...UserPublicationsConnectionFragment
      }
      posts {
        ...UserPostConnectionFragment
      }
      followersCount
      followingsCount
      tagline
      dateJoined
      location
      availableFor
      tagsFollowing {
        ...TagFragment
      }
      ambassador
      deactivated
      following
      followsBack
      followers {
        ...UserConnectionFragment
      }
      follows {
        ...UserConnectionFragment
      }
      techStack {
        ...UserTagsConnectionFragment
      }
    }
    publishAs {
      id
      username
      name
      bio {
        ...ContentFragment
      }
      bioV2 {
        ...ContentFragment
      }
      profilePicture
      socialMediaLinks {
        ...SocialMediaLinksFragment
      }
      badges {
        ...BadgeFragment
      }
      publications {
        ...UserPublicationsConnectionFragment
      }
      posts {
        ...UserPostConnectionFragment
      }
      followersCount
      followingsCount
      tagline
      dateJoined
      location
      availableFor
      tagsFollowing {
        ...TagFragment
      }
      ambassador
      deactivated
      following
      followsBack
      followers {
        ...UserConnectionFragment
      }
      follows {
        ...UserConnectionFragment
      }
      techStack {
        ...UserTagsConnectionFragment
      }
    }
    tags {
      id
      name
      slug
      logo
      tagline
      info {
        ...ContentFragment
      }
      followersCount
      postsCount
      posts {
        ...FeedPostConnectionFragment
      }
    }
    tagsV2 {
      ... on Tag {
        ...TagFragment
      }
      ... on DraftBaseTag {
        ...DraftBaseTagFragment
      }
    }
    canonicalUrl
    publication {
      id
      title
      displayTitle
      descriptionSEO
      about {
        ...ContentFragment
      }
      url
      canonicalURL
      author {
        ...UserFragment
      }
      favicon
      headerColor
      metaTags
      integrations {
        ...PublicationIntegrationsFragment
      }
      invites {
        ...PublicationInviteFragment
      }
      preferences {
        ...PreferencesFragment
      }
      followersCount
      imprint
      imprintV2 {
        ...ContentFragment
      }
      isTeam
      links {
        ...PublicationLinksFragment
      }
      domainInfo {
        ...DomainInfoFragment
      }
      isHeadless
      series {
        ...SeriesFragment
      }
      seriesList {
        ...SeriesConnectionFragment
      }
      posts {
        ...PublicationPostConnectionFragment
      }
      postsViaPage {
        ...PublicationPostPageConnectionFragment
      }
      pinnedPost {
        ...PostFragment
      }
      post {
        ...PostFragment
      }
      redirectedPost {
        ...PostFragment
      }
      ogMetaData {
        ...OpenGraphMetaDataFragment
      }
      features {
        ...PublicationFeaturesFragment
      }
      drafts {
        ...DraftConnectionFragment
      }
      allDrafts {
        ...DraftConnectionFragment
      }
      scheduledDrafts {
        ...DraftConnectionFragment
      }
      allScheduledDrafts {
        ...DraftConnectionFragment
      }
      staticPage {
        ...StaticPageFragment
      }
      staticPages {
        ...StaticPageConnectionFragment
      }
      submittedDrafts {
        ...DraftConnectionFragment
      }
      isGitHubBackupEnabled
      isGithubAsSourceConnected
      urlPattern
      emailImport {
        ...EmailImportFragment
      }
      redirectionRules {
        ...RedirectionRuleFragment
      }
      hasBadges
      sponsorship {
        ...PublicationSponsorshipFragment
      }
      recommendedPublications {
        ...UserRecommendedPublicationEdgeFragment
      }
      totalRecommendedPublications
      recommendingPublications {
        ...PublicationUserRecommendingPublicationConnectionFragment
      }
      allowContributorEdits
      members {
        ...PublicationMemberConnectionFragment
      }
      publicMembers {
        ...PublicationMemberConnectionFragment
      }
    }
    coverImage {
      url
      attribution
      photographer
      isAttributionHidden
    }
    readTimeInMinutes
    series {
      id
      name
      createdAt
      description {
        ...ContentFragment
      }
      coverImage
      author {
        ...UserFragment
      }
      cuid
      slug
      sortOrder
      posts {
        ...SeriesPostConnectionFragment
      }
    }
    content {
      markdown
      html
      text
    }
    dateUpdated
    updatedAt
    settings {
      disableComments
      stickCoverToBottom
      isDelisted
    }
    seo {
      title
      description
    }
    ogMetaData {
      image
    }
    features {
      tableOfContents {
        ...TableOfContentsFeatureFragment
      }
    }
    lastBackup {
      status
      at
    }
    lastSuccessfulBackupAt
    lastFailedBackupAt
    scheduledDate
    isSubmittedForReview
    publishedPost {
      id
      slug
      previousSlugs
      title
      subtitle
      author {
        ...UserFragment
      }
      coAuthors {
        ...UserFragment
      }
      tags {
        ...TagFragment
      }
      url
      canonicalUrl
      publication {
        ...PublicationFragment
      }
      cuid
      coverImage {
        ...PostCoverImageFragment
      }
      brief
      readTimeInMinutes
      views
      series {
        ...SeriesFragment
      }
      reactionCount
      replyCount
      responseCount
      featured
      contributors {
        ...UserFragment
      }
      commenters {
        ...PostCommenterConnectionFragment
      }
      comments {
        ...PostCommentConnectionFragment
      }
      bookmarked
      content {
        ...ContentFragment
      }
      likedBy {
        ...PostLikerConnectionFragment
      }
      featuredAt
      publishedAt
      updatedAt
      preferences {
        ...PostPreferencesFragment
      }
      audioUrls {
        ...AudioUrlsFragment
      }
      seo {
        ...SEOFragment
      }
      ogMetaData {
        ...OpenGraphMetaDataFragment
      }
      hasLatexInPost
      isFollowed
      isAutoPublishedFromRSS
      features {
        ...PostFeaturesFragment
      }
      sourcedFromGithub
    }
  }
}
Variables
{"id": ObjectId}
Response
{
  "data": {
    "draft": {
      "id": "4",
      "slug": "xyz789",
      "title": "abc123",
      "subtitle": "xyz789",
      "author": User,
      "coAuthors": [User],
      "publishAs": User,
      "tags": [Tag],
      "tagsV2": [Tag],
      "canonicalUrl": "abc123",
      "publication": Publication,
      "coverImage": DraftCoverImage,
      "readTimeInMinutes": 987,
      "series": Series,
      "content": Content,
      "dateUpdated": "2007-12-03T10:15:30Z",
      "updatedAt": "2007-12-03T10:15:30Z",
      "settings": DraftSettings,
      "seo": SEO,
      "ogMetaData": OpenGraphMetaData,
      "features": DraftFeatures,
      "lastBackup": DraftBackup,
      "lastSuccessfulBackupAt": "2007-12-03T10:15:30Z",
      "lastFailedBackupAt": "2007-12-03T10:15:30Z",
      "scheduledDate": "2007-12-03T10:15:30Z",
      "isSubmittedForReview": false,
      "publishedPost": Post
    }
  }
}
Queries
feed
Description
Returns a paginated list of posts based on the provided filter. Used in Hashnode home feed.

Response
Returns a FeedPostConnection!

Arguments
Name	Description
first - Int!	The number of items to be returned per page.
after - String	A cursor to the last item of the previous page.
filter - FeedFilter	Filters to be applied to the feed.
Example
Query
query Feed(
  $first: Int!,
  $after: String,
  $filter: FeedFilter
) {
  feed(
    first: $first,
    after: $after,
    filter: $filter
  ) {
    edges {
      node {
        ...PostFragment
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
Variables
{
  "first": 987,
  "after": "xyz789",
  "filter": FeedFilter
}
Response
{
  "data": {
    "feed": {
      "edges": [PostEdge],
      "pageInfo": PageInfo
    }
  }
}
Queries
me
Description
Returns the current authenticated user. Only available to the authenticated user.

Response
Returns a MyUser!

Example
Query
query Me {
  me {
    id
    username
    name
    bio {
      markdown
      html
      text
    }
    profilePicture
    socialMediaLinks {
      website
      github
      twitter
      instagram
      facebook
      stackoverflow
      linkedin
      youtube
      bluesky
    }
    emailNotificationPreferences {
      weeklyNewsletterEmails
      activityNotifications
      generalAnnouncements
      monthlyBlogStats
      newFollowersWeekly
    }
    badges {
      id
      name
      description
      image
      dateAssigned
      infoURL
      suppressed
    }
    publications {
      edges {
        ...UserPublicationsEdgeFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
      totalDocuments
    }
    posts {
      edges {
        ...UserPostEdgeFragment
      }
      nodes {
        ...PostFragment
      }
      pageInfo {
        ...OffsetPageInfoFragment
      }
      totalDocuments
    }
    followersCount
    followingsCount
    tagline
    dateJoined
    location
    availableFor
    tagsFollowing {
      id
      name
      slug
      logo
      tagline
      info {
        ...ContentFragment
      }
      followersCount
      postsCount
      posts {
        ...FeedPostConnectionFragment
      }
    }
    ambassador
    provider
    deactivated
    betaFeatures {
      id
      key
      title
      description
      url
      enabled
    }
    email
    unverifiedEmail
    followers {
      nodes {
        ...UserFragment
      }
      pageInfo {
        ...OffsetPageInfoFragment
      }
      totalDocuments
    }
    follows {
      nodes {
        ...UserFragment
      }
      pageInfo {
        ...OffsetPageInfoFragment
      }
      totalDocuments
    }
    drafts {
      edges {
        ...UserDraftEdgeFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
      totalDocuments
    }
    role
    techStack {
      nodes {
        ...TagFragment
      }
      pageInfo {
        ...OffsetPageInfoFragment
      }
      totalDocuments
    }
  }
}
Response
{
  "data": {
    "me": {
      "id": "4",
      "username": "xyz789",
      "name": "abc123",
      "bio": Content,
      "profilePicture": "abc123",
      "socialMediaLinks": SocialMediaLinks,
      "emailNotificationPreferences": EmailNotificationPreferences,
      "badges": [Badge],
      "publications": UserPublicationsConnection,
      "posts": UserPostConnection,
      "followersCount": 123,
      "followingsCount": 123,
      "tagline": "abc123",
      "dateJoined": "2007-12-03T10:15:30Z",
      "location": "abc123",
      "availableFor": "xyz789",
      "tagsFollowing": [Tag],
      "ambassador": false,
      "provider": "xyz789",
      "deactivated": false,
      "betaFeatures": [BetaFeature],
      "email": "xyz789",
      "unverifiedEmail": "abc123",
      "followers": UserConnection,
      "follows": UserConnection,
      "drafts": UserDraftConnection,
      "role": "SUPERUSER",
      "techStack": UserTagsConnection
    }
  }
}
Queries
post
Description
Returns post by ID. Can be used to render post page on blog.

Response
Returns a Post

Arguments
Name	Description
id - ID!	The ID of the post to be returned.
Example
Query
query Post($id: ID!) {
  post(id: $id) {
    id
    slug
    previousSlugs
    title
    subtitle
    author {
      id
      username
      name
      bio {
        ...ContentFragment
      }
      bioV2 {
        ...ContentFragment
      }
      profilePicture
      socialMediaLinks {
        ...SocialMediaLinksFragment
      }
      badges {
        ...BadgeFragment
      }
      publications {
        ...UserPublicationsConnectionFragment
      }
      posts {
        ...UserPostConnectionFragment
      }
      followersCount
      followingsCount
      tagline
      dateJoined
      location
      availableFor
      tagsFollowing {
        ...TagFragment
      }
      ambassador
      deactivated
      following
      followsBack
      followers {
        ...UserConnectionFragment
      }
      follows {
        ...UserConnectionFragment
      }
      techStack {
        ...UserTagsConnectionFragment
      }
    }
    coAuthors {
      id
      username
      name
      bio {
        ...ContentFragment
      }
      bioV2 {
        ...ContentFragment
      }
      profilePicture
      socialMediaLinks {
        ...SocialMediaLinksFragment
      }
      badges {
        ...BadgeFragment
      }
      publications {
        ...UserPublicationsConnectionFragment
      }
      posts {
        ...UserPostConnectionFragment
      }
      followersCount
      followingsCount
      tagline
      dateJoined
      location
      availableFor
      tagsFollowing {
        ...TagFragment
      }
      ambassador
      deactivated
      following
      followsBack
      followers {
        ...UserConnectionFragment
      }
      follows {
        ...UserConnectionFragment
      }
      techStack {
        ...UserTagsConnectionFragment
      }
    }
    tags {
      id
      name
      slug
      logo
      tagline
      info {
        ...ContentFragment
      }
      followersCount
      postsCount
      posts {
        ...FeedPostConnectionFragment
      }
    }
    url
    canonicalUrl
    publication {
      id
      title
      displayTitle
      descriptionSEO
      about {
        ...ContentFragment
      }
      url
      canonicalURL
      author {
        ...UserFragment
      }
      favicon
      headerColor
      metaTags
      integrations {
        ...PublicationIntegrationsFragment
      }
      invites {
        ...PublicationInviteFragment
      }
      preferences {
        ...PreferencesFragment
      }
      followersCount
      imprint
      imprintV2 {
        ...ContentFragment
      }
      isTeam
      links {
        ...PublicationLinksFragment
      }
      domainInfo {
        ...DomainInfoFragment
      }
      isHeadless
      series {
        ...SeriesFragment
      }
      seriesList {
        ...SeriesConnectionFragment
      }
      posts {
        ...PublicationPostConnectionFragment
      }
      postsViaPage {
        ...PublicationPostPageConnectionFragment
      }
      pinnedPost {
        ...PostFragment
      }
      post {
        ...PostFragment
      }
      redirectedPost {
        ...PostFragment
      }
      ogMetaData {
        ...OpenGraphMetaDataFragment
      }
      features {
        ...PublicationFeaturesFragment
      }
      drafts {
        ...DraftConnectionFragment
      }
      allDrafts {
        ...DraftConnectionFragment
      }
      scheduledDrafts {
        ...DraftConnectionFragment
      }
      allScheduledDrafts {
        ...DraftConnectionFragment
      }
      staticPage {
        ...StaticPageFragment
      }
      staticPages {
        ...StaticPageConnectionFragment
      }
      submittedDrafts {
        ...DraftConnectionFragment
      }
      isGitHubBackupEnabled
      isGithubAsSourceConnected
      urlPattern
      emailImport {
        ...EmailImportFragment
      }
      redirectionRules {
        ...RedirectionRuleFragment
      }
      hasBadges
      sponsorship {
        ...PublicationSponsorshipFragment
      }
      recommendedPublications {
        ...UserRecommendedPublicationEdgeFragment
      }
      totalRecommendedPublications
      recommendingPublications {
        ...PublicationUserRecommendingPublicationConnectionFragment
      }
      allowContributorEdits
      members {
        ...PublicationMemberConnectionFragment
      }
      publicMembers {
        ...PublicationMemberConnectionFragment
      }
    }
    cuid
    coverImage {
      url
      isPortrait
      attribution
      photographer
      isAttributionHidden
    }
    brief
    readTimeInMinutes
    views
    series {
      id
      name
      createdAt
      description {
        ...ContentFragment
      }
      coverImage
      author {
        ...UserFragment
      }
      cuid
      slug
      sortOrder
      posts {
        ...SeriesPostConnectionFragment
      }
    }
    reactionCount
    replyCount
    responseCount
    featured
    contributors {
      id
      username
      name
      bio {
        ...ContentFragment
      }
      bioV2 {
        ...ContentFragment
      }
      profilePicture
      socialMediaLinks {
        ...SocialMediaLinksFragment
      }
      badges {
        ...BadgeFragment
      }
      publications {
        ...UserPublicationsConnectionFragment
      }
      posts {
        ...UserPostConnectionFragment
      }
      followersCount
      followingsCount
      tagline
      dateJoined
      location
      availableFor
      tagsFollowing {
        ...TagFragment
      }
      ambassador
      deactivated
      following
      followsBack
      followers {
        ...UserConnectionFragment
      }
      follows {
        ...UserConnectionFragment
      }
      techStack {
        ...UserTagsConnectionFragment
      }
    }
    commenters {
      edges {
        ...PostCommenterEdgeFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
      totalDocuments
    }
    comments {
      edges {
        ...PostCommentEdgeFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
      totalDocuments
    }
    bookmarked
    content {
      markdown
      html
      text
    }
    likedBy {
      edges {
        ...PostLikerEdgeFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
      totalDocuments
    }
    featuredAt
    publishedAt
    updatedAt
    preferences {
      pinnedToBlog
      disableComments
      stickCoverToBottom
      isDelisted
    }
    audioUrls {
      male
      female
    }
    seo {
      title
      description
    }
    ogMetaData {
      image
    }
    hasLatexInPost
    isFollowed
    isAutoPublishedFromRSS
    features {
      tableOfContents {
        ...TableOfContentsFeatureFragment
      }
      badges {
        ...PostBadgesFeatureFragment
      }
    }
    sourcedFromGithub
  }
}
Variables
{"id": 4}
Response
{
  "data": {
    "post": {
      "id": 4,
      "slug": "xyz789",
      "previousSlugs": ["xyz789"],
      "title": "xyz789",
      "subtitle": "abc123",
      "author": User,
      "coAuthors": [User],
      "tags": [Tag],
      "url": "abc123",
      "canonicalUrl": "xyz789",
      "publication": Publication,
      "cuid": "xyz789",
      "coverImage": PostCoverImage,
      "brief": "abc123",
      "readTimeInMinutes": 123,
      "views": 987,
      "series": Series,
      "reactionCount": 987,
      "replyCount": 123,
      "responseCount": 987,
      "featured": true,
      "contributors": [User],
      "commenters": PostCommenterConnection,
      "comments": PostCommentConnection,
      "bookmarked": true,
      "content": Content,
      "likedBy": PostLikerConnection,
      "featuredAt": "2007-12-03T10:15:30Z",
      "publishedAt": "2007-12-03T10:15:30Z",
      "updatedAt": "2007-12-03T10:15:30Z",
      "preferences": PostPreferences,
      "audioUrls": AudioUrls,
      "seo": SEO,
      "ogMetaData": OpenGraphMetaData,
      "hasLatexInPost": true,
      "isFollowed": true,
      "isAutoPublishedFromRSS": false,
      "features": PostFeatures,
      "sourcedFromGithub": false
    }
  }
}
Queries
publication
Description
Returns the publication with the given ID or host. User can pass anyone of them.

Response
Returns a Publication

Arguments
Name	Description
id - ObjectId	The ID of the publication.
host - String	The host of the publication.
Example
Query
query Publication(
  $id: ObjectId,
  $host: String
) {
  publication(
    id: $id,
    host: $host
  ) {
    id
    title
    displayTitle
    descriptionSEO
    about {
      markdown
      html
      text
    }
    url
    canonicalURL
    author {
      id
      username
      name
      bio {
        ...ContentFragment
      }
      bioV2 {
        ...ContentFragment
      }
      profilePicture
      socialMediaLinks {
        ...SocialMediaLinksFragment
      }
      badges {
        ...BadgeFragment
      }
      publications {
        ...UserPublicationsConnectionFragment
      }
      posts {
        ...UserPostConnectionFragment
      }
      followersCount
      followingsCount
      tagline
      dateJoined
      location
      availableFor
      tagsFollowing {
        ...TagFragment
      }
      ambassador
      deactivated
      following
      followsBack
      followers {
        ...UserConnectionFragment
      }
      follows {
        ...UserConnectionFragment
      }
      techStack {
        ...UserTagsConnectionFragment
      }
    }
    favicon
    headerColor
    metaTags
    integrations {
      fbPixelID
      fathomSiteID
      fathomCustomDomainEnabled
      fathomCustomDomain
      hotjarSiteID
      matomoSiteID
      matomoURL
      gaTrackingID
      plausibleAnalyticsEnabled
      wmPaymentPointer
      umamiWebsiteUUID
      umamiShareId
      gTagManagerID
      koalaPublicKey
      msClarityID
    }
    invites {
      pendingInvites {
        ...PendingInviteConnectionFragment
      }
      roleBasedInvites {
        ...RoleBasedInviteConnectionFragment
      }
      areRoleBasedInviteLinksActive
    }
    preferences {
      logo
      darkMode {
        ...DarkModePreferencesFragment
      }
      enabledPages {
        ...PagesPreferencesFragment
      }
      navbarItems {
        ...PublicationNavbarItemFragment
      }
      layout
      disableFooterBranding
      isSubscriptionModalDisabled
    }
    followersCount
    imprint
    imprintV2 {
      markdown
      html
      text
    }
    isTeam
    links {
      twitter
      instagram
      github
      website
      hashnode
      youtube
      dailydev
      linkedin
      mastodon
      facebook
      bluesky
    }
    domainInfo {
      hashnodeSubdomain
      domain {
        ...DomainStatusFragment
      }
      wwwPrefixedDomain {
        ...DomainStatusFragment
      }
    }
    isHeadless
    series {
      id
      name
      createdAt
      description {
        ...ContentFragment
      }
      coverImage
      author {
        ...UserFragment
      }
      cuid
      slug
      sortOrder
      posts {
        ...SeriesPostConnectionFragment
      }
    }
    seriesList {
      edges {
        ...SeriesEdgeFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
      totalDocuments
    }
    posts {
      edges {
        ...PostEdgeFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
      totalDocuments
    }
    postsViaPage {
      nodes {
        ...PostFragment
      }
      pageInfo {
        ...OffsetPageInfoFragment
      }
      totalDocuments
    }
    pinnedPost {
      id
      slug
      previousSlugs
      title
      subtitle
      author {
        ...UserFragment
      }
      coAuthors {
        ...UserFragment
      }
      tags {
        ...TagFragment
      }
      url
      canonicalUrl
      publication {
        ...PublicationFragment
      }
      cuid
      coverImage {
        ...PostCoverImageFragment
      }
      brief
      readTimeInMinutes
      views
      series {
        ...SeriesFragment
      }
      reactionCount
      replyCount
      responseCount
      featured
      contributors {
        ...UserFragment
      }
      commenters {
        ...PostCommenterConnectionFragment
      }
      comments {
        ...PostCommentConnectionFragment
      }
      bookmarked
      content {
        ...ContentFragment
      }
      likedBy {
        ...PostLikerConnectionFragment
      }
      featuredAt
      publishedAt
      updatedAt
      preferences {
        ...PostPreferencesFragment
      }
      audioUrls {
        ...AudioUrlsFragment
      }
      seo {
        ...SEOFragment
      }
      ogMetaData {
        ...OpenGraphMetaDataFragment
      }
      hasLatexInPost
      isFollowed
      isAutoPublishedFromRSS
      features {
        ...PostFeaturesFragment
      }
      sourcedFromGithub
    }
    post {
      id
      slug
      previousSlugs
      title
      subtitle
      author {
        ...UserFragment
      }
      coAuthors {
        ...UserFragment
      }
      tags {
        ...TagFragment
      }
      url
      canonicalUrl
      publication {
        ...PublicationFragment
      }
      cuid
      coverImage {
        ...PostCoverImageFragment
      }
      brief
      readTimeInMinutes
      views
      series {
        ...SeriesFragment
      }
      reactionCount
      replyCount
      responseCount
      featured
      contributors {
        ...UserFragment
      }
      commenters {
        ...PostCommenterConnectionFragment
      }
      comments {
        ...PostCommentConnectionFragment
      }
      bookmarked
      content {
        ...ContentFragment
      }
      likedBy {
        ...PostLikerConnectionFragment
      }
      featuredAt
      publishedAt
      updatedAt
      preferences {
        ...PostPreferencesFragment
      }
      audioUrls {
        ...AudioUrlsFragment
      }
      seo {
        ...SEOFragment
      }
      ogMetaData {
        ...OpenGraphMetaDataFragment
      }
      hasLatexInPost
      isFollowed
      isAutoPublishedFromRSS
      features {
        ...PostFeaturesFragment
      }
      sourcedFromGithub
    }
    redirectedPost {
      id
      slug
      previousSlugs
      title
      subtitle
      author {
        ...UserFragment
      }
      coAuthors {
        ...UserFragment
      }
      tags {
        ...TagFragment
      }
      url
      canonicalUrl
      publication {
        ...PublicationFragment
      }
      cuid
      coverImage {
        ...PostCoverImageFragment
      }
      brief
      readTimeInMinutes
      views
      series {
        ...SeriesFragment
      }
      reactionCount
      replyCount
      responseCount
      featured
      contributors {
        ...UserFragment
      }
      commenters {
        ...PostCommenterConnectionFragment
      }
      comments {
        ...PostCommentConnectionFragment
      }
      bookmarked
      content {
        ...ContentFragment
      }
      likedBy {
        ...PostLikerConnectionFragment
      }
      featuredAt
      publishedAt
      updatedAt
      preferences {
        ...PostPreferencesFragment
      }
      audioUrls {
        ...AudioUrlsFragment
      }
      seo {
        ...SEOFragment
      }
      ogMetaData {
        ...OpenGraphMetaDataFragment
      }
      hasLatexInPost
      isFollowed
      isAutoPublishedFromRSS
      features {
        ...PostFeaturesFragment
      }
      sourcedFromGithub
    }
    ogMetaData {
      image
    }
    features {
      newsletter {
        ...NewsletterFeatureFragment
      }
      viewCount {
        ...ViewCountFeatureFragment
      }
      readTime {
        ...ReadTimeFeatureFragment
      }
      audioBlog {
        ...AudioBlogFeatureFragment
      }
      textSelectionSharer {
        ...TextSelectionSharerFeatureFragment
      }
      customCSS {
        ...CustomCSSFeatureFragment
      }
      headlessCMS {
        ...HeadlessCMSFeatureFragment
      }
      proTeam {
        ...ProTeamFeatureFragment
      }
      gptBotCrawling {
        ...GPTBotCrawlingFeatureFragment
      }
    }
    drafts {
      edges {
        ...DraftEdgeFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
      totalDocuments
    }
    allDrafts {
      edges {
        ...DraftEdgeFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
      totalDocuments
    }
    scheduledDrafts {
      edges {
        ...DraftEdgeFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
      totalDocuments
    }
    allScheduledDrafts {
      edges {
        ...DraftEdgeFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
      totalDocuments
    }
    staticPage {
      id
      title
      slug
      content {
        ...ContentFragment
      }
      hidden
      ogMetaData {
        ...OpenGraphMetaDataFragment
      }
      seo {
        ...SEOFragment
      }
    }
    staticPages {
      edges {
        ...StaticPageEdgeFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
      totalDocuments
    }
    submittedDrafts {
      edges {
        ...DraftEdgeFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
      totalDocuments
    }
    isGitHubBackupEnabled
    isGithubAsSourceConnected
    urlPattern
    emailImport {
      currentImport {
        ...EmailCurrentImportFragment
      }
    }
    redirectionRules {
      id
      type
      source
      destination
    }
    hasBadges
    sponsorship {
      content {
        ...ContentFragment
      }
      stripe {
        ...StripeConfigurationFragment
      }
    }
    recommendedPublications {
      node {
        ...PublicationFragment
      }
      totalFollowersGained
    }
    totalRecommendedPublications
    recommendingPublications {
      edges {
        ...UserRecommendingPublicationEdgeFragment
      }
      nodes {
        ...PublicationFragment
      }
      pageInfo {
        ...OffsetPageInfoFragment
      }
      totalDocuments
    }
    allowContributorEdits
    members {
      nodes {
        ...PublicationMemberFragment
      }
      pageInfo {
        ...OffsetPageInfoFragment
      }
      totalDocuments
    }
    publicMembers {
      nodes {
        ...PublicationMemberFragment
      }
      pageInfo {
        ...OffsetPageInfoFragment
      }
      totalDocuments
    }
  }
}
Variables
{
  "id": ObjectId,
  "host": "abc123"
}
Response
{
  "data": {
    "publication": {
      "id": 4,
      "title": "abc123",
      "displayTitle": "abc123",
      "descriptionSEO": "abc123",
      "about": Content,
      "url": "xyz789",
      "canonicalURL": "xyz789",
      "author": User,
      "favicon": "abc123",
      "headerColor": "abc123",
      "metaTags": "xyz789",
      "integrations": PublicationIntegrations,
      "invites": PublicationInvite,
      "preferences": Preferences,
      "followersCount": 987,
      "imprint": "xyz789",
      "imprintV2": Content,
      "isTeam": true,
      "links": PublicationLinks,
      "domainInfo": DomainInfo,
      "isHeadless": true,
      "series": Series,
      "seriesList": SeriesConnection,
      "posts": PublicationPostConnection,
      "postsViaPage": PublicationPostPageConnection,
      "pinnedPost": Post,
      "post": Post,
      "redirectedPost": Post,
      "ogMetaData": OpenGraphMetaData,
      "features": PublicationFeatures,
      "drafts": DraftConnection,
      "allDrafts": DraftConnection,
      "scheduledDrafts": DraftConnection,
      "allScheduledDrafts": DraftConnection,
      "staticPage": StaticPage,
      "staticPages": StaticPageConnection,
      "submittedDrafts": DraftConnection,
      "isGitHubBackupEnabled": false,
      "isGithubAsSourceConnected": false,
      "urlPattern": "DEFAULT",
      "emailImport": EmailImport,
      "redirectionRules": [RedirectionRule],
      "hasBadges": true,
      "sponsorship": PublicationSponsorship,
      "recommendedPublications": [
        UserRecommendedPublicationEdge
      ],
      "totalRecommendedPublications": 987,
      "recommendingPublications": PublicationUserRecommendingPublicationConnection,
      "allowContributorEdits": false,
      "members": PublicationMemberConnection,
      "publicMembers": PublicationMemberConnection
    }
  }
}
Queries
scheduledPost
Description
Get a scheduled post by ID.

Response
Returns a ScheduledPost

Arguments
Name	Description
id - ObjectId	The ID of the scheduled post to get.
Example
Query
query ScheduledPost($id: ObjectId) {
  scheduledPost(id: $id) {
    id
    author {
      id
      username
      name
      bio {
        ...ContentFragment
      }
      bioV2 {
        ...ContentFragment
      }
      profilePicture
      socialMediaLinks {
        ...SocialMediaLinksFragment
      }
      badges {
        ...BadgeFragment
      }
      publications {
        ...UserPublicationsConnectionFragment
      }
      posts {
        ...UserPostConnectionFragment
      }
      followersCount
      followingsCount
      tagline
      dateJoined
      location
      availableFor
      tagsFollowing {
        ...TagFragment
      }
      ambassador
      deactivated
      following
      followsBack
      followers {
        ...UserConnectionFragment
      }
      follows {
        ...UserConnectionFragment
      }
      techStack {
        ...UserTagsConnectionFragment
      }
    }
    draft {
      id
      slug
      title
      subtitle
      author {
        ...UserFragment
      }
      coAuthors {
        ...UserFragment
      }
      publishAs {
        ...UserFragment
      }
      tags {
        ...TagFragment
      }
      tagsV2 {
        ... on Tag {
          ...TagFragment
        }
        ... on DraftBaseTag {
          ...DraftBaseTagFragment
        }
      }
      canonicalUrl
      publication {
        ...PublicationFragment
      }
      coverImage {
        ...DraftCoverImageFragment
      }
      readTimeInMinutes
      series {
        ...SeriesFragment
      }
      content {
        ...ContentFragment
      }
      dateUpdated
      updatedAt
      settings {
        ...DraftSettingsFragment
      }
      seo {
        ...SEOFragment
      }
      ogMetaData {
        ...OpenGraphMetaDataFragment
      }
      features {
        ...DraftFeaturesFragment
      }
      lastBackup {
        ...DraftBackupFragment
      }
      lastSuccessfulBackupAt
      lastFailedBackupAt
      scheduledDate
      isSubmittedForReview
      publishedPost {
        ...PostFragment
      }
    }
    scheduledDate
    scheduledBy {
      id
      username
      name
      bio {
        ...ContentFragment
      }
      bioV2 {
        ...ContentFragment
      }
      profilePicture
      socialMediaLinks {
        ...SocialMediaLinksFragment
      }
      badges {
        ...BadgeFragment
      }
      publications {
        ...UserPublicationsConnectionFragment
      }
      posts {
        ...UserPostConnectionFragment
      }
      followersCount
      followingsCount
      tagline
      dateJoined
      location
      availableFor
      tagsFollowing {
        ...TagFragment
      }
      ambassador
      deactivated
      following
      followsBack
      followers {
        ...UserConnectionFragment
      }
      follows {
        ...UserConnectionFragment
      }
      techStack {
        ...UserTagsConnectionFragment
      }
    }
    publication {
      id
      title
      displayTitle
      descriptionSEO
      about {
        ...ContentFragment
      }
      url
      canonicalURL
      author {
        ...UserFragment
      }
      favicon
      headerColor
      metaTags
      integrations {
        ...PublicationIntegrationsFragment
      }
      invites {
        ...PublicationInviteFragment
      }
      preferences {
        ...PreferencesFragment
      }
      followersCount
      imprint
      imprintV2 {
        ...ContentFragment
      }
      isTeam
      links {
        ...PublicationLinksFragment
      }
      domainInfo {
        ...DomainInfoFragment
      }
      isHeadless
      series {
        ...SeriesFragment
      }
      seriesList {
        ...SeriesConnectionFragment
      }
      posts {
        ...PublicationPostConnectionFragment
      }
      postsViaPage {
        ...PublicationPostPageConnectionFragment
      }
      pinnedPost {
        ...PostFragment
      }
      post {
        ...PostFragment
      }
      redirectedPost {
        ...PostFragment
      }
      ogMetaData {
        ...OpenGraphMetaDataFragment
      }
      features {
        ...PublicationFeaturesFragment
      }
      drafts {
        ...DraftConnectionFragment
      }
      allDrafts {
        ...DraftConnectionFragment
      }
      scheduledDrafts {
        ...DraftConnectionFragment
      }
      allScheduledDrafts {
        ...DraftConnectionFragment
      }
      staticPage {
        ...StaticPageFragment
      }
      staticPages {
        ...StaticPageConnectionFragment
      }
      submittedDrafts {
        ...DraftConnectionFragment
      }
      isGitHubBackupEnabled
      isGithubAsSourceConnected
      urlPattern
      emailImport {
        ...EmailImportFragment
      }
      redirectionRules {
        ...RedirectionRuleFragment
      }
      hasBadges
      sponsorship {
        ...PublicationSponsorshipFragment
      }
      recommendedPublications {
        ...UserRecommendedPublicationEdgeFragment
      }
      totalRecommendedPublications
      recommendingPublications {
        ...PublicationUserRecommendingPublicationConnectionFragment
      }
      allowContributorEdits
      members {
        ...PublicationMemberConnectionFragment
      }
      publicMembers {
        ...PublicationMemberConnectionFragment
      }
    }
  }
}
Variables
{"id": ObjectId}
Response
{
  "data": {
    "scheduledPost": {
      "id": "4",
      "author": User,
      "draft": Draft,
      "scheduledDate": "2007-12-03T10:15:30Z",
      "scheduledBy": User,
      "publication": Publication
    }
  }
}
Queries
searchPostsOfPublication
Description
Returns a paginated list of posts based on search query for a particular publication id.

Response
Returns a SearchPostConnection!

Arguments
Name	Description
first - Int!	The number of items to be returned per page.
after - String	A cursor to the last item of the previous page.
sortBy - PostSortBy	The sort order.
filter - SearchPostsOfPublicationFilter!	The filter to be applied to the search.
Example
Query
query SearchPostsOfPublication(
  $first: Int!,
  $after: String,
  $sortBy: PostSortBy,
  $filter: SearchPostsOfPublicationFilter!
) {
  searchPostsOfPublication(
    first: $first,
    after: $after,
    sortBy: $sortBy,
    filter: $filter
  ) {
    edges {
      node {
        ...PostFragment
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
Variables
{
  "first": 987,
  "after": "xyz789",
  "sortBy": "DATE_PUBLISHED_ASC",
  "filter": SearchPostsOfPublicationFilter
}
Response
{
  "data": {
    "searchPostsOfPublication": {
      "edges": [PostEdge],
      "pageInfo": PageInfo
    }
  }
}
Queries
tag
Description
Returns tag details by its slug.

Response
Returns a Tag

Arguments
Name	Description
slug - String!	The slug of the tag to retrieve.
Example
Query
query Tag($slug: String!) {
  tag(slug: $slug) {
    id
    name
    slug
    logo
    tagline
    info {
      markdown
      html
      text
    }
    followersCount
    postsCount
    posts {
      edges {
        ...PostEdgeFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
}
Variables
{"slug": "xyz789"}
Response
{
  "data": {
    "tag": {
      "id": 4,
      "name": "abc123",
      "slug": "abc123",
      "logo": "xyz789",
      "tagline": "xyz789",
      "info": Content,
      "followersCount": 123,
      "postsCount": 987,
      "posts": FeedPostConnection
    }
  }
}
Queries
topCommenters
Description
Returns users who have most actively participated in discussions by commenting in the last 7 days.

Response
Returns a CommenterUserConnection!

Arguments
Name	Description
first - Int!	The maximum number of users to return.
after - String	A cursor to the last item of the previous page.
Example
Query
query TopCommenters(
  $first: Int!,
  $after: String
) {
  topCommenters(
    first: $first,
    after: $after
  ) {
    edges {
      node {
        ...UserFragment
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
Variables
{"first": 987, "after": "xyz789"}
Response
{
  "data": {
    "topCommenters": {
      "edges": [UserEdge],
      "pageInfo": PageInfo
    }
  }
}
Queries
user
Description
Returns the user with the username.

Response
Returns a User

Arguments
Name	Description
username - String!	The username of the user to retrieve.
Example
Query
query User($username: String!) {
  user(username: $username) {
    id
    username
    name
    bio {
      markdown
      html
      text
    }
    bioV2 {
      markdown
      html
      text
    }
    profilePicture
    socialMediaLinks {
      website
      github
      twitter
      instagram
      facebook
      stackoverflow
      linkedin
      youtube
      bluesky
    }
    badges {
      id
      name
      description
      image
      dateAssigned
      infoURL
      suppressed
    }
    publications {
      edges {
        ...UserPublicationsEdgeFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
      totalDocuments
    }
    posts {
      edges {
        ...UserPostEdgeFragment
      }
      nodes {
        ...PostFragment
      }
      pageInfo {
        ...OffsetPageInfoFragment
      }
      totalDocuments
    }
    followersCount
    followingsCount
    tagline
    dateJoined
    location
    availableFor
    tagsFollowing {
      id
      name
      slug
      logo
      tagline
      info {
        ...ContentFragment
      }
      followersCount
      postsCount
      posts {
        ...FeedPostConnectionFragment
      }
    }
    ambassador
    deactivated
    following
    followsBack
    followers {
      nodes {
        ...UserFragment
      }
      pageInfo {
        ...OffsetPageInfoFragment
      }
      totalDocuments
    }
    follows {
      nodes {
        ...UserFragment
      }
      pageInfo {
        ...OffsetPageInfoFragment
      }
      totalDocuments
    }
    techStack {
      nodes {
        ...TagFragment
      }
      pageInfo {
        ...OffsetPageInfoFragment
      }
      totalDocuments
    }
  }
}
Variables
{"username": "xyz789"}
Response
{
  "data": {
    "user": {
      "id": 4,
      "username": "xyz789",
      "name": "xyz789",
      "bio": Content,
      "bioV2": Content,
      "profilePicture": "xyz789",
      "socialMediaLinks": SocialMediaLinks,
      "badges": [Badge],
      "publications": UserPublicationsConnection,
      "posts": UserPostConnection,
      "followersCount": 123,
      "followingsCount": 123,
      "tagline": "abc123",
      "dateJoined": "2007-12-03T10:15:30Z",
      "location": "abc123",
      "availableFor": "abc123",
      "tagsFollowing": [Tag],
      "ambassador": false,
      "deactivated": false,
      "following": true,
      "followsBack": false,
      "followers": UserConnection,
      "follows": UserConnection,
      "techStack": UserTagsConnection
    }
  }