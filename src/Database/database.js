import Dexie from 'dexie';

const db = new Dexie("Reddex");

window.db = db;
db.version(1).stores({
  inbox_messages: "++id, first_message, first_message_name, replies, id, subject, author, new, body, dest, name, created"
});

export default db;

// first_message: null
// first_message_name: null
// subreddit: null
// likes: null
// replies: {kind: "Listing", data: {modhash: null, dist: null,…}}
// id: "9sxme5"
// subject: "Cashier stalker story"
// was_comment: false
// score: 0
// author: "StoriesAfterMidnight"
// num_comments: null
// parent_id: null
// subreddit_name_prefixed: null
// new: false
// body: "Hey! I'm Tyrel and I was wondering if I could read your story on my relatively new YouTube channels, Stories After Midnight?↵↵Thanks!"
// dest: "horizntalartist"
// body_html: "&lt;!-- SC_OFF --&gt;&lt;div class="md"&gt;&lt;p&gt;Hey! I&amp;#39;m Tyrel and I was wondering if I could read your story on my relatively new YouTube channels, Stories After Midnight?&lt;/p&gt;↵↵&lt;p&gt;Thanks!&lt;/p&gt;↵&lt;/div&gt;&lt;!-- SC_ON --&gt;"
// name: "t4_9sxme5"
// created: 1509060285
// created_utc: 1509031485
// context: ""
// distinguished: null