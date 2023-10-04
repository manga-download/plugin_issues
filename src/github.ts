export interface Issue {
    title: string;
    short_desc: string;
    html_url: string;
    time: Date;
    connector: string; 
}
 const github_url='https://api.github.com/repos/manga-download/hakuneko'

 // Get open connector issues
export async function getConnectorIssues() : Promise<Issue[]> {
    const response = await fetch(
        `${github_url}/issues?state=open&labels=Website%20Change`,
        import.meta.env.DEV ? { cache: "force-cache" } : {}
    );
    const result= await response.json();
    if (response.status!==200) throw new Error(result.message);

    return result.map(issue => ({
        title: issue.title,
        html_url: issue.html_url,
        time: new Date(issue.created_at),
        connector: issue.title.match(/\[(.*?)\]/) ? issue.title.match(/\[(.*?)\]/)[1] : '<???>',
        short_desc: issue.title.match(/(\[.*?\])?(.*)/)[2],
    } as Issue));
}

export async function getRecentCompletedIssues() : Promise <Issue[]> {
    let  aMonthsAgo = new Date();
    aMonthsAgo.setMonth(aMonthsAgo.getMonth() - 1);

    // Get recent fix
    const response = await fetch(
        `${github_url}/issues?state=closed&labels=Website%20Change&since=${aMonthsAgo.toISOString()}`,
        import.meta.env.DEV ? { cache: "force-cache" } : {}
    );
    const result_raw= await response.json();
    if (response.status!==200) throw new Error(result_raw.message);

    const result = result_raw.filter(item => item.state_reason==='completed');
    return result
    .map(issue => ({
        title: issue.title,
        html_url: issue.html_url,
        time: new Date(issue.closed_at),
        connector: issue.title.match(/\[(.*?)\]/) ? issue.title.match(/\[(.*?)\]/)[1] : '<???>',
        short_desc: issue.title.match(/(\[.*?\])?(.*)/)[2],
    } as Issue));
}



