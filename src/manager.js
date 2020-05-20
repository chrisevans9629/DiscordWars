var events = {};

events.move = (from,to,amt) => { console.log("moved!")};
events.level = {};
window.events = events;
export {events};