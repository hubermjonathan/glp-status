const API_URL = 'https://zn8ccw1uwi.execute-api.us-west-2.amazonaws.com/default/stacks';
const API_KEY = process.env.API_KEY;

export default async function submitStackReport(req, res) {
    const numberOfStacks = JSON.parse(req.body).numberOfStacks;
    const stacksQueryString = `?number_of_stacks=${numberOfStacks}`

    const stacksData = await fetch(API_URL + stacksQueryString, {
        method: 'POST',
        cache: 'no-store',
        headers: {
            'X-Api-Key': API_KEY,
        },
    })
    .then(res => res.json());
    
    stacksData.sort((a,b) => b['report_time'] - a['report_time']);

    if (stacksData.length !== 0) {
        res.status(200).json(stacksData[0]['number_of_stacks']);
    } else {
        res.status(200).json(-1);
    }
}