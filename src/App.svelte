<script lang="ts">
  import {
    Navbar,
    NavBrand,
    Input,
    Button,
    Timeline,
    TimelineItem,
  } from 'flowbite-svelte';
  import {
    ArrowRightOutline,
    CalendarWeekSolid,
    SearchOutline,
  } from 'flowbite-svelte-icons';

  import { timeAgo, sinceclass } from './util';

  import type { Issue } from './github';
  import { getConnectorIssues, getRecentCompletedIssues } from './github';

  import HakuNeko from './assets/HaruNeko.svg';

  let openIssues: Promise<Issue[]> = getConnectorIssues();
  let recentClosed: Promise<Issue[]> = getRecentCompletedIssues();
  let issuesFilter = '';
  let timeline: HTMLElement;
</script>

<Navbar let:NavContainer>
  <NavContainer
    class="w-full bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 "
  >
    <NavBrand href="/">
      <img src={HakuNeko} class="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
      <span
        class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
        >HakuNeko connector issues</span
      >
    </NavBrand>
    <div class="flex items-center lg:order-2">
      <Button
        href="https://github.com/manga-download/hakuneko/issues/new/choose"
        class="ml-2"
        color="red">Report a connector not working</Button
      >
    </div>
    <form class="w-96">
      <Input
        id="search"
        placeholder="Type a connector name ..."
        size="lg"
        bind:value={issuesFilter}
      >
        <SearchOutline
          slot="left"
          class="w-6 h-6 text-gray-500 dark:text-gray-400"
        />
      </Input>
    </form>
  </NavContainer>
</Navbar>
<div class="h-48 flex">
  <h3 class="flex-none m-8 text-xl font-bold">
    Recently<br />closed
  </h3>
  <div
    bind:this={timeline}
    class="flex-1 w-4/5 overflow-x-hidden hover:overflow-x-auto overflow-y-hidden scroll-smooth"
  >
    <Timeline order="horizontal">
      {#await recentClosed}
        Loading...
      {:then issues}
        {@const filteredIssues = issuesFilter
          ? issues.filter((issue) => issue.title.includes(issuesFilter))
          : issues}
        {#each filteredIssues as issue (issue.html_url)}
          <TimelineItem
            title={issue.connector.substring(0, 12)}
            date={timeAgo(issue.time)}
            classTime="{sinceclass(issue.time)} dark:{sinceclass(issue.time)}"
          >
            <svelte:fragment slot="icon">
              <div class="flex items-center">
                <div
                  class="flex justify-center items-center w-6 h-6 bg-primary-200 rounded-full ring-0 ring-white dark:bg-primary-900 sm:ring-8 dark:ring-gray-900 shrink-0"
                >
                  <CalendarWeekSolid
                    class="w-3 h-3 text-primary-600 dark:text-primary-400"
                  />
                </div>
                <div
                  class="hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"
                />
              </div>
            </svelte:fragment>
            <p
              class="w-36 text-base font-normal text-gray-500 dark:text-gray-400"
            >
              <a href={issue.html_url}>{issue.short_desc}</a>
            </p>
          </TimelineItem>
        {/each}
      {:catch error}
        <p style="color: red">{error.message}</p>
      {/await}
    </Timeline>
  </div>
  <Button
    class="flex-none w-16 ml-8"
    on:click={() => (timeline.scrollLeft += 200)}
    ><ArrowRightOutline class="w-full h-full" /></Button
  >
</div>

<div class="p-3 inline-block">
  <h3 class="pb-4 text-3xl font-bold">Open Issues</h3>
  {#await openIssues}
    Loading...
  {:then issues}
    {@const filteredIssues = issuesFilter
      ? issues.filter((issue) => issue.title.includes(issuesFilter))
      : issues}
    <div
      id="open-issues"
      class="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 overflow-hidden"
    >
      {#each filteredIssues as issue (issue.html_url)}
        <a
          href={issue.html_url}
          class=" items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <div
            class="w-24 float-right translate-x-4 translate-y-3 text-xs {sinceclass(
              issue.time
            )} dark:{sinceclass(issue.time)}"
          >
            {timeAgo(issue.time)}
          </div>
          <div class="p-2">
            <h5
              class="mb-1 font-bold tracking-tight text-gray-900 dark:text-white"
            >
              {issue.connector}
            </h5>
            <p class=" text-xs text-gray-700 dark:text-gray-400">
              {issue.short_desc}
            </p>
          </div>
        </a>
      {/each}
    </div>
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
</div>
