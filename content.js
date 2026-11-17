// Single source for the deck (/) and the kit (/kit). Edit text and minutes here.
// Each session = a title screen, then scenes. Scene types: cards, flow, nest, graph, table, chat, media, poll, reveal, chart, score.

const PRE = {
  claude: { plan: '/ecc:plan ', grill: '/mattpocock-skills:grilling ', build: '/ecc:prp-implement ', pilot: '/ecc:plan ', setup: '', video: '/ecc:plan ', render: '/ecc:prp-implement ' },
  codex: { plan: 'Use the ECC plan skill. ', grill: 'Use the grilling skill. ', build: 'Use the ECC prp-implement skill. ', pilot: 'Use the ECC plan skill. ', setup: '', video: 'Use the ECC plan skill. ', render: 'Use the ECC prp-implement skill. ' },
};
const BODY = {
  setup: () => `Set up this computer to make videos. Check each item first and install only what is missing.
Use Homebrew on a Mac and winget on Windows. Ask me before each install.
1. Node.js 20 or newer.
2. Git.
3. Python 3.11.
4. Remotion skills: npx skills add remotion-dev/skills
5. Hairline skill: npx skills add lucasmarkes/hairline
6. Chatterbox, a free voice: make a Python 3.11 virtual environment in this folder, then pip install chatterbox-tts
7. Prove it works: render a 3-second Remotion test video with one spoken Chatterbox line.
Finish with a table of what was already there, what you installed, and what failed.`,
  plan: t => `Plan a research report on this topic: ${t}.
Scope
1. Break the topic into 4 to 6 research questions. Answer each one.
2. Use at least 12 sources. Prefer official statistics, government and trade bodies, company filings, academic papers and major news. Use blogs only to find leads.
3. Note the date of every source. Prefer the last 3 years unless the topic is historical.
Rules
4. Only cite pages you actually opened. Never invent a number, quote or link.
5. Every claim gets a source. Where sources disagree, show both sides.
6. Rate each finding: Confirmed (2 or more good sources), Likely (1 good source) or Unverified.
Output: research.html, a report I can read in the browser, and research.md with the same content.
7. Executive summary: 5 bullets, the answer first.
8. Key findings: one section per research question, each with its evidence, rating and sources.
9. Numbers: a table with figure, year, unit and source. A chart where it helps.
10. Timeline of key events, if the topic has one.
11. Who matters: the main countries, companies, people or bodies, and their role.
12. What this means for a trading and consulting company like ours: opportunities and risks.
13. Open questions and what would settle them.
14. Sources: title, publisher, date and link, numbered and cited in the text.
15. If this folder has a DESIGN.md, follow it for colours and type.`,
  video: t => `Research this topic on the web: ${t}.
Then plan a 60-second explainer video from the findings.
1. Build it with Remotion.
2. Follow DESIGN.md for colours and type.
3. Use one three.js 3D scene.
4. Use a thinking-orbs narrator.
5. Use hairline charts for any numbers.
6. Add a Chatterbox voice-over with captions.
7. Plan the scenes second by second.`,
  grill: () => 'Grill me on this plan before we build. Ask fewer than 5 questions in total, in one round.',
  build: () => 'Write the research report from the approved plan. Before you finish, check every number and quote against its source and fix or remove anything that does not match. Then open research.html in my browser and list what you could not confirm.',
  render: () => 'Build the video from the approved plan. Render it to out/video.mp4 and tell me how long it took.',
  pilot: () => `Build a first version of this agent with Hermes.
1. Agent name: [NAME]
2. Its job, in one line: [JOB]
3. What it reads: [INPUTS]
4. What it sends, and to whom: [OUTPUT]
5. How often it runs: [SCHEDULE]
6. Rule: a person approves before anything goes outside the company.
7. Rule: public or made-up data only for now.
Give me the setup steps and the agent's instructions.`,
};
const PLUGINS = `/plugin marketplace add affaan-m/ECC
/plugin install ecc@ecc
/plugin marketplace add mattpocock/skills
/plugin install mattpocock-skills@mattpocock
/plugin marketplace add pbakaus/impeccable
/plugin install impeccable@impeccable`;

window.WORKSHOP = {
  title: 'Vernalis AI Agents Workshop',
  objective: 'Get everyone comfortable deploying, running and monitoring AI agents on their own machine, safely.',
  prompt: (key, topic, tool) => (key === 'plugins' ? PLUGINS : PRE[tool || 'claude'][key] + BODY[key](topic)),
  topics: [
    { t: 'History of the Cyrillic script in Russian', d: 'Where the alphabet came from, how it changed, and why it looks the way it does today.' },
    { t: 'Market gaps Belarus can fill in India', d: 'Where Belarus is strong, what India buys from abroad, and where the two meet.' },
    { t: 'How top consultancies use AI', d: 'The Big 4 first, then MBB, then others. What they built and what it changed.' },
  ],
  candidates: ['Topic research', 'Client research', 'Commodity trade profitability'],
  dims: ['Value', 'Effort', 'Data sensitivity', 'Running cost'],

  sessions: [
    { n: 1, title: 'Why we’re here', min: 10, shape: 'raven',
      lead: 'An agent setup already works for us. Today you learn how it works, and we choose what to build next.',
      scenes: [
        { sub: 'Eleven this morning', type: 'reveal',
          q: 'Who read fifty news feeds on rapid tests at eleven this morning?',
          a: 'Nobody on the team.',
          d: 'quiq-post did. It reads about 50 feeds at 11 and again at 5, then brings up to five cards to our Telegram group.' },
        { sub: 'Meet QUIQ Raven', type: 'flow', note: 'QUIQ Raven is our bot on Telegram, and the group it lives in. Nothing goes public until the team says yes.',
          nodes: [
            { icon: 'search', t: 'Agents research', d: 'News feeds, papers, supplier sites.' },
            { icon: 'doc', t: 'They draft', d: 'An article, an answer, a reel.' },
            { logo: 'telegram', t: 'A card lands', d: 'In the QUIQ Raven group on Telegram.' },
            { icon: 'user', t: 'The team decides', d: 'One tap on a button.', tone: 'amber' },
            { logos: ['youtube', 'instagram'], t: 'It goes public', d: 'Blog, YouTube, Instagram.' },
          ] },
        { sub: 'Five agents, one bot', type: 'cards', items: [
          { icon: 'news', k: 'quiq-post', t: 'Finds the news', d: 'Runs at 11 and at 5. Reads about 50 feeds on rapid tests. Posts up to five cards and a podcast idea.' },
          { icon: 'search', k: 'teh-quiq', t: 'Researches', d: 'Answers questions with sources. Ask it, or tap Research deeper on a card.' },
          { logos: ['madeinchina.png', 'alibabadotcom'], k: 'e-quiq', t: 'Sources products', d: 'Searches makers, IndiaMART, Made-in-China and Alibaba. Exact matches only, with price and minimum order.' },
          { logos: ['gh-remotion-dev.png'], k: 'flicq', t: 'Makes reels', d: 'Turns a card or a live article into a vertical reel of about a minute.' },
          { logos: ['youtube', 'instagram'], k: 'quiq-cast', t: 'Posts them', d: 'Writes captions for YouTube and Instagram. Posts only after a tap.' },
        ] },
        { sub: 'What it looks like in Telegram', type: 'chat', note: 'Drawn from the real group. The buttons are the real ones; the text is an example.',
          chats: [
            { who: 'quiq-post', lines: ['Card', 'A news item on rapid tests, with a short summary and the source link.'], buttons: ['Approve', 'Skip', 'Research deeper', 'Reel'] },
            { who: 'flicq', lines: ['Reel ready for review', 'A vertical video of about a minute, made from a card.'], buttons: ['Approve', 'Suggest changes', 'Discard'] },
            { who: 'e-quiq', lines: ['Sourcing request', 'Exact matches only, each with price and minimum order.'], buttons: [] },
          ] },
        { sub: 'A reel flicq made', type: 'media', video: 'assets/reel.mp4', facts: [
          { t: 'About a minute, vertical', d: 'Made from a card or a live article.' },
          { t: 'Reviewed in the group', d: 'Approve, Suggest changes, or Discard.' },
          { t: 'It learns', d: 'Change notes are remembered, so the next draft starts closer to what the team likes.' },
          { t: 'Then quiq-cast takes over', d: 'Captions for YouTube and Instagram, posted after a tap.' },
        ] },
        { sub: 'What we leave with today', type: 'cards', cols: 2, items: [
          { k: 'Deliverable 1', t: 'One AI agent, deployed', d: 'Built live for one real application.' },
          { k: 'Deliverable 2', t: 'A final list of agents to build', d: 'For Vernalis, QUIQ and Edelflo.' },
        ] },
      ] },

    { n: 2, title: 'Setup together', min: 40, shape: 'prompt',
      lead: 'Claude Code, plugins, skills, and the free tools behind our videos.',
      scenes: [
        { sub: 'Chat and Claude Code', type: 'cards', cols: 2, items: [
          { logo: 'claude', k: 'Claude chat', t: 'Answers in a window', list: ['You paste text in.', 'You copy the answer out.', 'It cannot touch your files.'] },
          { icon: 'laptop', k: 'Claude Code', t: 'Works on your computer', tone: 'iris', list: ['Reads the files in one folder.', 'Runs tools and makes new files.', 'Asks before each action.'] },
        ] },
        { sub: 'Skill, plugin, Claude Code', type: 'nest', layers: [
          { t: 'Claude Code', d: 'The workshop. Where the work happens.' },
          { t: 'Plugin', d: 'A toolbox. Installed with one command.' },
          { t: 'Skill', d: 'One tool. A saved way of doing a task, run by typing /name.' },
        ] },
        { sub: 'The three plugins we use', type: 'cards', items: [
          { icon: 'tools', k: '/ecc:plan', t: 'ECC', d: 'Plans the work before any building starts, then builds it step by step.' },
          { logo: 'aihero.png', k: '/mattpocock-skills:grilling', t: 'Matt Pocock skills', d: 'Questions your plan until the gaps show.' },
          { logo: 'impeccable', k: '/impeccable', t: 'Impeccable', d: 'Keeps the design clean and consistent.' },
        ] },
        { sub: 'Open source', type: 'flow', loop: true, note: 'We pay with setup time, not money.', nodes: [
          { logo: 'github', t: 'Someone writes a tool' },
          { t: 'Publishes the code', d: 'Free, for everyone.' },
          { t: 'Anyone uses it' },
          { t: 'Anyone improves it', tone: 'amber' },
        ] },
        { sub: 'Free tools behind our videos', type: 'cards', items: [
          { logo: 'gh-remotion-dev.png', k: 'Video', t: 'Remotion', d: 'Video written as code.' },
          { logo: 'threedotjs', k: '3D', t: 'three.js', d: '3D scenes in the browser.' },
          { logo: 'gh-RareFormLabs.png', k: 'Narrator', t: 'thinking-orbs', d: 'The dotted sphere that speaks.' },
          { logo: 'hairline', k: 'Charts', t: 'Hairline', d: 'Clean charts for numbers.' },
          { logo: 'gh-resemble-ai.png', k: 'Voice', t: 'Chatterbox', d: 'A voice that runs on your machine.' },
        ] },
        { sub: 'DESIGN.md', type: 'flow', note: 'One file that tells Claude how things should look.', link: { href: 'https://styles.refero.design/', t: 'styles.refero.design', logo: 'refero.png' }, nodes: [
          { t: 'A website you like' },
          { logo: 'refero.png', t: 'styles.refero.design', d: 'Pick its style.' },
          { icon: 'doc', t: 'DESIGN.md', d: 'Colours, type, spacing.', tone: 'iris' },
          { logo: 'claude', t: 'Claude reads it' },
          { t: 'Your work, in that style' },
        ] },
        { sub: 'Claude Code or Codex', type: 'cards', cols: 2, items: [
          { logo: 'claude', k: 'Anthropic', t: 'Claude Code', list: ['Comes with Claude Pro.', 'Plugins are added with /plugin.'] },
          { logo: 'codex', k: 'OpenAI', t: 'Codex', list: ['Comes with ChatGPT plans.', 'Skills are added from the terminal.'] },
        ] },
        { sub: 'The kit', type: 'cards', cols: 1, items: [
          { k: 'One page to copy from', t: 'Install commands and prompts, for Claude Code and Codex, Mac and Windows', href: 'kit/' },
        ] },
      ] },

    { n: 3, title: 'Research with plugins', min: 20, shape: 'lens',
      lead: 'One topic, chosen by the room.',
      scenes: [
        { sub: 'Three topics', type: 'poll' },
        { sub: 'Three inputs to Claude Code', type: 'flow', nodes: [
          { k: '1', icon: 'tools', t: 'Plan', d: '/ecc:plan breaks the topic into questions and plans the report.' },
          { k: '2', logo: 'aihero.png', t: 'Questions', d: 'Grilling asks fewer than five.' },
          { k: '3', icon: 'tools', t: 'Build', d: '/ecc:prp-implement builds from the plan.' },
          { icon: 'doc', t: 'A sourced research report', tone: 'amber' },
        ] },
      ] },

    { n: 4, title: 'Video creation', min: 30, shape: 'play',
      lead: 'From a topic to a 60-second video, live.',
      scenes: [
        { sub: 'The pipeline', type: 'flow', nodes: [
          { icon: 'search', t: 'Research', d: 'Web sources.' },
          { icon: 'doc', t: 'Script', d: '60 seconds.' },
          { icon: 'chat', t: 'Voice', d: 'Narration and captions.' },
          { logo: 'threedotjs', t: 'Scenes', d: 'three.js, orbs, hairline.' },
          { logo: 'gh-remotion-dev.png', t: 'Render', d: 'Remotion, frame by frame.' },
          { icon: 'play', t: 'MP4', d: 'out/video.mp4', tone: 'amber' },
        ] },
        { sub: 'The three inputs', type: 'cards', items: [
          { icon: 'tools', k: '1 · /ecc:plan', t: 'Plan', d: 'Researches the chosen topic and plans the video scene by scene.', copy: 'video' },
          { logo: 'aihero.png', k: '2 · /mattpocock-skills:grilling', t: 'Questions', d: 'Fewer than five questions, in one round.', copy: 'grill' },
          { icon: 'tools', k: '3 · /ecc:prp-implement', t: 'Build', d: 'Builds the scenes and renders the video.', copy: 'render' },
        ] },
        { sub: 'What Claude does while we wait', type: 'cards', items: [
          { icon: 'search', t: 'Searches and reads', d: 'Opens web sources and keeps the links.' },
          { icon: 'doc', t: 'Writes', d: 'The script and the scene plan.' },
          { icon: 'chip', t: 'Builds', d: 'Each scene, as code.' },
          { icon: 'clock', t: 'Renders', d: 'Frame by frame, into one file.' },
        ] },
      ] },

    { n: 5, title: 'Agents in practice', min: 12, shape: 'network',
      lead: 'How an agent works, and what it needs to run.',
      scenes: [
        { sub: 'How an agent works', type: 'seq',
          actors: [
            { logo: 'telegram', t: 'Telegram', d: 'Where you talk to it.' },
            { logo: 'nousresearch', t: 'Hermes', d: 'The program that runs the agent.' },
            { logos: ['apple', 'googlecloud'], t: 'Your Mac or a cloud machine', d: 'Where Hermes lives.' },
            { logos: ['openrouter', 'anthropic', 'openai'], t: 'Model API', d: 'The brain, rented.' },
          ],
          msgs: [
            { from: 2, to: 1, t: 'The machine keeps Hermes running. At 11, it wakes the agent.' },
            { from: 1, to: 3, t: 'Hermes sends the job and the instructions to the model.' },
            { from: 3, to: 1, t: 'The model replies: “search these three sites”.' },
            { from: 1, to: 1, t: 'Hermes runs the search and reads the pages.' },
            { from: 1, to: 3, t: 'It sends what it read. The model writes the draft.' },
            { from: 1, to: 0, t: 'Hermes posts the draft as a card in Telegram.' },
            { from: 0, to: 1, t: 'You tap Approve. Only then does it go out.', tone: 'amber' },
          ] },
        { sub: 'API', type: 'api',
          full: 'Application Programming Interface',
          plain: 'A fixed way for one program to ask another for something, and get an answer back. No screen, no clicks: a message in, a message out.',
          req: [['Key', 'sk-…  (proves who pays)'], ['Model', 'deepseek-chat'], ['Message', 'Summarise today’s steel prices in 3 lines.']],
          res: [['Answer', 'Steel rose 2% this week…'], ['Words used', '1,240 tokens'], ['Cost', 'a fraction of a rupee']],
          note: 'Every app with AI inside, including Hermes, talks to a model this way.' },
        { sub: 'Claude Pro or a model API', type: 'cards', cols: 2, items: [
          { logo: 'claude', k: 'Claude Pro', t: 'For a person at the keyboard', list: ['Chat and Claude Code.', 'A fixed monthly fee.', 'Cannot run an agent on its own, day and night.'] },
          { logos: ['openrouter', 'anthropic', 'openai'], k: 'Model API', t: 'For programs, like an agent', tone: 'iris', list: ['Hermes calls it by itself, on schedule.', 'Pay per use.', 'This is what an agent needs.'] },
        ] },
        { sub: 'Where an agent lives', type: 'cards', items: [
          { logo: 'apple', t: 'Your laptop', d: 'Free. It stops when the lid closes.' },
          { logos: ['googlecloud', 'aws', 'azure'], t: 'A cloud machine', d: 'Monthly rent. Runs day and night. QUIQ’s agents run on one.' },
          { logo: 'nvidia', t: 'A local rig', d: 'One-time cost. Nothing leaves the office.' },
        ] },
        { sub: 'Hermes', type: 'cards', cols: 4, items: [
          { logo: 'nousresearch', t: 'Runs the agents', d: 'One program for all of them. Made by Nous Research.' },
          { icon: 'calendar', t: 'Wakes them on time', d: 'Each agent has its own schedule.' },
          { logo: 'telegram', t: 'Connects to Telegram', d: 'So the team can reply and approve.' },
          { logo: 'github', t: 'Free and open source', d: 'The code is public.' },
        ] },
      ] },

    { n: 6, title: 'Models', min: 13, shape: 'layers',
      lead: 'Who makes them, how big they are, and where you rent them.',
      scenes: [
        { sub: 'Who makes the models', type: 'cards', groups: [
          { label: 'Closed: you can only rent them', items: [
            { logo: 'claude', t: 'Claude', d: 'Anthropic' }, { logo: 'openai', t: 'GPT', d: 'OpenAI' }, { logo: 'googlegemini', t: 'Gemini', d: 'Google' },
          ] },
          { label: 'Open: anyone can run them', items: [
            { logo: 'meta', t: 'Llama', d: 'Meta' }, { logo: 'mistralai', t: 'Mistral', d: 'Mistral AI' }, { logo: 'deepseek', t: 'DeepSeek', d: 'DeepSeek' },
            { logo: 'qwen', t: 'Qwen', d: 'Alibaba' }, { logo: 'gemma', t: 'Gemma', d: 'Google' }, { logo: 'kimi', t: 'Kimi', d: 'Moonshot AI' },
          ] },
        ] },
        { sub: 'Open and closed', type: 'cards', cols: 2, items: [
          { icon: 'lock', k: 'Closed', t: 'You rent it', list: ['The maker runs it.', 'You never see inside.', 'Usually the strongest.'] },
          { icon: 'eye', k: 'Open', t: 'The weights are public', tone: 'iris', list: ['Anyone can run it, including you.', 'Often cheaper.', 'Private, if it runs on your own machine.'] },
        ] },
        { sub: 'Parameters', type: 'table', key: 'sizes',
          intro: 'Parameters are the numbers a model learned in training. More of them: smarter, and heavier to run.' },
        { sub: 'Where you rent them', type: 'cards', groups: [
          { label: 'Direct from the maker', items: [
            { logo: 'anthropic', t: 'Anthropic', d: 'Claude' }, { logo: 'openai', t: 'OpenAI', d: 'GPT' }, { logo: 'google', t: 'Google', d: 'Gemini' }, { logo: 'deepseek', t: 'DeepSeek', d: 'DeepSeek' },
          ] },
          { label: 'Through a third party', items: [
            { logo: 'openrouter', t: 'OpenRouter', d: 'One account, hundreds of models.' },
            { logo: 'groq', t: 'Groq', d: 'Open models, served very fast.' },
            { logo: 'together', t: 'Together AI', d: 'Open models, in many sizes.' },
            { logo: 'fireworks', t: 'Fireworks AI', d: 'Open models, for production.' },
          ] },
        ] },
        { sub: 'A local rig for daily tasks', type: 'cards', cols: 4, items: [
          { logo: 'apple', t: 'A Mac', d: 'Apple chip, 32 GB of memory or more.' },
          { logo: 'nvidia', t: 'Or a PC', d: 'A graphics card with 16 to 24 GB of its own memory.' },
          { logos: ['ollama', 'lmstudio'], t: 'Free software', d: 'Ollama or LM Studio runs the model.' },
          { icon: 'alert', t: 'The trade-off', d: 'Slower and less capable than the best rented models.', tone: 'amber' },
        ] },
      ] },

    { n: 7, title: 'Costs', min: 10, shape: 'rupee',
      lead: 'Four ways to pay.',
      scenes: [
        { sub: 'Four ways to pay', type: 'cards', items: [
          { logo: 'claude', k: 'Fixed', t: 'Claude Pro', d: 'One monthly fee. Covers Claude Code. Not for agents.' },
          { logos: ['openrouter', 'anthropic'], k: 'Per use', t: 'Model API', d: 'Small jobs cost little. Daily agents add up.' },
          { logos: ['googlecloud', 'aws'], k: 'Rent', t: 'Cloud machine', d: 'A monthly fee so the agent runs day and night.' },
          { logo: 'nvidia', k: 'One time', t: 'Local rig', d: 'A large cost up front, then electricity.' },
        ] },
        { sub: 'How the bill grows', type: 'chart', note: 'An illustration of the shapes, not our figures.',
          series: [
            { t: 'Local rig', tone: 'ash', pts: [8, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 9, 9.1, 9.2] },
            { t: 'Model API, heavy use', tone: 'amber', pts: [0, .6, 1.4, 2.3, 3.3, 4.4, 5.6, 6.9, 8.3, 9.8, 11.4, 13.1, 14.9] },
            { t: 'Claude Pro', tone: 'iris', pts: [0, .5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6] },
            { t: 'Cloud machine', tone: 'bone', pts: [0, .3, .6, .9, 1.2, 1.5, 1.8, 2.1, 2.4, 2.7, 3, 3.3, 3.6] },
          ] },
        { sub: 'What drives the bill', type: 'cards', items: [
          { icon: 'clock', t: 'How often it runs', d: 'Twice a day costs twice as much as once.' },
          { icon: 'doc', t: 'How much it reads', d: 'Long documents cost more than short ones.' },
          { icon: 'chip', t: 'Which model it uses', d: 'The strongest models cost many times more.' },
          { icon: 'cloud', t: 'Where it lives', d: 'Laptop, cloud or rig.' },
        ] },
      ] },

    { n: 8, title: 'Privacy and safe use', min: 15, shape: 'shield',
      lead: 'What leaves your machine, who keeps it, and what never to paste.',
      scenes: [
        { sub: 'Free models', type: 'reveal',
          q: 'Why is a free model free?',
          list: [
            { icon: 'eye', t: 'Your prompts may pay for it', d: 'The provider can keep what you type and train on it.', tone: 'red' },
            { icon: 'globe', t: 'Your data may leave the country', d: 'It is stored wherever the provider’s servers are.', tone: 'red' },
            { icon: 'clock', t: 'It is a sample', d: 'Tight daily limits, slower answers, and it can stop at any time.' },
            { icon: 'chip', t: 'It is often a smaller model', d: 'Older or lighter versions, to keep the cost down.' },
          ] },
        { sub: 'DeepSeek', type: 'compare', logo: 'deepseek',
          intro: 'Strong, open, and free to use in its own app. The catch is where your words go.',
          sides: [
            { tone: 'red', k: 'DeepSeek’s own app or API', path: [{ icon: 'user', t: 'You' }, { logo: 'deepseek', t: 'DeepSeek' }, { icon: 'globe', t: 'Servers in China' }],
              d: 'Its privacy policy says what you send is stored on servers in China, and may be used to improve its models.' },
            { tone: 'ok', k: 'The same model, through OpenRouter', path: [{ icon: 'user', t: 'You' }, { logo: 'openrouter', t: 'OpenRouter' }, { logos: ['together', 'fireworks'], t: 'A host outside China' }],
              d: 'The model is open, so other companies run it on their own servers. In OpenRouter, block DeepSeek as a provider and block providers that train on data.' },
          ] },
        { sub: 'Where your words go', type: 'flow', note: 'Each red step is a place your text can be kept.', nodes: [
          { icon: 'laptop', t: 'Your laptop', d: 'It stays here only if the model is local.' },
          { logos: ['claude', 'nousresearch'], t: 'Claude Code or Hermes', d: 'Sends what the task needs.' },
          { logos: ['openrouter', 'groq', 'together'], t: 'A third party', d: 'OpenRouter, Groq, Together AI.', tone: 'red' },
          { logos: ['anthropic', 'openai', 'deepseek'], t: 'The model maker', d: 'May keep it. May train on it.', tone: 'red' },
        ] },
        { sub: 'Providers differ', type: 'table', key: 'privacy' },
        { sub: 'Never paste', type: 'cards', items: [
          { icon: 'user', t: 'Client details', tone: 'red' },
          { icon: 'coin', t: 'Pricing', tone: 'red' },
          { icon: 'doc', t: 'Contracts', tone: 'red' },
          { icon: 'lock', t: 'Passwords', tone: 'red' },
          { icon: 'key', t: 'API keys', tone: 'red' },
        ] },
        { sub: 'On your own machine', type: 'cards', items: [
          { icon: 'folder', t: 'One folder', d: 'Never the whole drive.' },
          { icon: 'eye', t: 'Read each request', d: 'Claude asks before it acts.' },
          { icon: 'alert', t: 'Never “allow all”', d: 'It removes the only checkpoint.', tone: 'red' },
          { icon: 'user', t: 'A person approves', d: 'Before anything goes outside.' },
        ] },
      ] },

    { n: 9, title: 'Candidate agents', min: 10, shape: 'trio',
      lead: 'The three we shortlisted.',
      scenes: [
        { sub: 'Topic research', type: 'flow', note: 'Deep research on any topic, the way teh-quiq does it for QUIQ.', nodes: [
          { icon: 'chat', t: 'A topic' },
          { icon: 'search', t: 'Reads the web', d: 'Many sources, in minutes.' },
          { icon: 'doc', t: 'A report with sources' },
          { logo: 'telegram', t: 'Approval', d: 'In Telegram.', tone: 'amber' },
        ] },
        { sub: 'Client research', type: 'flow', note: 'For every new Edelflo client.', nodes: [
          { icon: 'user', t: 'A new client’s name' },
          { icon: 'search', t: 'Site, news, public records' },
          { icon: 'doc', t: 'A one-page brief' },
          { icon: 'chat', t: 'Ready before the first call', tone: 'amber' },
        ] },
        { sub: 'Commodity trade profitability', type: 'flow', note: 'Is this trade worth our time at this margin? It stops effort going into trades that will not pay.', nodes: [
          { icon: 'box', t: 'A commodity', d: 'Steel, for example.' },
          { icon: 'coin', t: 'Price, freight, duty, exchange rate' },
          { icon: 'chip', t: 'The margin' },
          { icon: 'check', t: 'Go, or no-go', tone: 'amber' },
        ] },
      ] },

    { n: 10, title: 'Brainstorm', min: 20, shape: 'burst',
      lead: 'New agent ideas for QUIQ, Edelflo and Vernalis.',
      scenes: [
        { sub: 'Signs of a good agent task', type: 'cards', items: [
          { icon: 'calendar', t: 'It repeats', d: 'Every day or every week.' },
          { icon: 'doc', t: 'It means a lot of reading', d: 'Feeds, sites, documents.' },
          { icon: 'check', t: 'It follows clear rules', d: 'You could explain it to a new joiner.' },
          { icon: 'user', t: 'A person can check it', d: 'Before it goes anywhere.' },
        ] },
        { sub: 'Three companies', type: 'cards', items: [
          { k: 'Running today', t: 'QUIQ', list: ['News', 'Research', 'Sourcing', 'Reels', 'Posting'] },
          { k: 'Shortlisted', t: 'Edelflo', list: ['Client research', 'Commodity trade profitability'] },
          { k: 'Open', t: 'Vernalis', list: ['Topic research', 'Your ideas'] },
        ] },
      ] },

    { n: 11, title: 'Plan and prioritise', min: 20, shape: 'bars',
      lead: 'Four dimensions, scored High, Medium or Low.',
      scenes: [
        { sub: 'Four dimensions', type: 'cards', items: [
          { icon: 'coin', t: 'Value', d: 'The time or money it saves.' },
          { icon: 'tools', t: 'Effort', d: 'How hard it is to build.' },
          { icon: 'lock', t: 'Data sensitivity', d: 'From session 8: what it would need to read.' },
          { icon: 'chip', t: 'Running cost', d: 'From session 7: how often, how much, which model.' },
        ] },
        { sub: 'Score the ideas', type: 'score' },
      ] },

    { n: 12, title: 'Commit', min: 12, shape: 'check',
      lead: 'One pilot, one owner, thirty days.',
      scenes: [
        { sub: 'The pilot', type: 'cards', items: [
          { icon: 'robot', t: 'One pilot agent', d: 'The top of our list.' },
          { icon: 'user', t: 'One owner', d: 'A named person.' },
          { logo: 'nousresearch', t: 'A first draft, today', d: 'Planned with Hermes, on made-up data.', copy: 'pilot' },
        ] },
        { sub: 'Thirty days', type: 'flow', nodes: [
          { k: 'Week 1', t: 'First draft', d: 'Made-up data only.' },
          { k: 'Week 2', t: 'Test and fix' },
          { k: 'Week 3', t: 'A real run', d: 'With approval on every output.' },
          { k: 'Week 4', t: 'Review', d: 'Keep, change or stop.', tone: 'amber' },
        ] },
      ] },
  ],

  // Parameter counts: open models publish theirs; closed makers do not, so those rows say so.
  sizes: {
    checked: 'Open-model sizes are from each maker’s release notes. Closed makers do not publish sizes; frontier models are widely estimated at a trillion or more.',
    head: ['Size', 'Example', 'Parameters', 'Runs on', 'Good for'],
    rows: [
      ['Small', { logo: 'gemma', t: 'Gemma 3 4B (Google)' }, '4 billion', 'A laptop', 'Summaries, sorting email'],
      ['Small', { logo: 'meta', t: 'Llama 3.1 8B (Meta)' }, '8 billion', 'A laptop', 'Short drafts, simple questions'],
      ['Medium', { logo: 'mistralai', t: 'Mistral Small (Mistral AI)' }, '24 billion', 'A Mac with 32 GB', 'Daily writing, research notes'],
      ['Medium', { logo: 'meta', t: 'Llama 3.3 70B (Meta)' }, '70 billion', 'A Mac with 64 GB, or a big graphics card', 'Strong everyday work'],
      ['Large', { logo: 'deepseek', t: 'DeepSeek V3 (DeepSeek)' }, '671 billion', 'A data centre', 'Reasoning, coding, long reports'],
      ['Large', { logo: 'kimi', t: 'Kimi K2 (Moonshot AI)' }, '1 trillion', 'A data centre', 'Agents and tool use'],
      [['Frontier', 'amber'], { logos: ['claude', 'openai', 'googlegemini'], t: 'Claude Fable, GPT, Gemini' }, ['Not published, likely trillions', 'amber'], 'A data centre, rented only', 'The hardest work, and agents'],
    ],
  },

  // Checked against each provider's own docs on the date below. Policies change. Cell = text or [text, tone].
  privacy: {
    checked: 'Checked 17 Nov 2026 against each provider’s own policy. Policies change, so check again before using real data.',
    head: ['Provider', 'Keeps your prompts?', 'Trains on them?', 'Switch on'],
    rows: [
      [{ logo: 'claude', t: 'Claude (Pro)' }, ['Yes', 'amber'], ['Your choice, in settings', 'amber'], 'Turn off “Help improve Claude”'],
      [{ logo: 'deepseek', t: 'DeepSeek (own app, API)' }, ['Yes, on servers in China', 'red'], ['May use it to improve models', 'red'], 'Use it through OpenRouter instead'],
      [{ logo: 'openrouter', t: 'OpenRouter' }, ['No by default', 'ok'], ['Depends on the provider. Free models often do', 'red'], 'Block providers that train; block DeepSeek'],
      [{ logo: 'groq', t: 'Groq' }, ['Up to 30 days', 'amber'], ['Read its terms first', 'amber'], 'Zero Data Retention'],
      [{ logo: 'together', t: 'Together AI' }, ['Yes by default', 'red'], ['Only if you opt in', 'ok'], 'Zero Data Retention'],
      [{ logos: ['azure', 'googlecloud', 'aws'], t: 'Azure, Google, AWS' }, ['Set by contract', 'amber'], ['Not on business plans', 'ok'], 'Company agreement'],
      [{ logo: 'ollama', t: 'Local model' }, ['No', 'ok'], ['No', 'ok'], 'Nothing needed'],
    ],
  },
};

// Shared by deck and kit. Falls back to execCommand where the clipboard API is blocked.
window.copyText = (text, btn) => {
  const done = () => {
    if (!btn) return;
    btn.dataset.o ||= btn.textContent;
    btn.textContent = 'Copied';
    setTimeout(() => (btn.textContent = btn.dataset.o), 1200);
  };
  const fallback = () => {
    const t = document.createElement('textarea');
    t.value = text; document.body.append(t); t.select();
    document.execCommand('copy'); t.remove(); done();
  };
  navigator.clipboard ? navigator.clipboard.writeText(text).then(done, fallback) : fallback();
};

console.assert(WORKSHOP.sessions.reduce((t, s) => t + s.min, 0) <= 240, 'session time budgets must fit in 240 minutes');
