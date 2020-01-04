import Dexie from 'dexie';

const db = new Dexie("Reddex");

window.db = db;
db.version(1).stores({
  inbox_message: "++id, author, title, selftext, ups, url, num_comments, created"
});

export default db;