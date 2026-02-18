1) What is the difference between null and undefined?
Ans:null হলো ইচ্ছাকৃত খালি মান, undefined হলো অনিবার্য অনুপস্থিত মান। null হলো একটি ইচ্ছাকৃত অনুপস্থিতির মান এটি একটি object টাইপ (typeof null === "object") প্রোগ্রামার ইচ্ছাকৃতভাবে কোনো ভেরিয়েবলের মান null সেট করেন যখন সেটি খালি বা অনুপস্থিত বোঝাতে চান উদাহরণ: let user = null; // user বর্তমানে কোনো মান নেই undefined হলো একটি অনিবার্য অনুপস্থিতির মান

এটি একটি undefined টাইপ (typeof undefined === "undefined")
যখন কোনো ভেরিয়েবল ডিক্লেয়ার করা হয় কিন্তু মান অ্যাসাইন করা হয় না, তখন তার মান undefined হয়
উদাহরণ: let name; console.log(name); // undefined
2) What is the use of the map() function in JavaScript? How is it different from forEach()?
map() নতুন array তৈরি করে, forEach() শুধু iteration করে।

3) What is the difference between == and ===?
== শুধু value compare করে এবং প্রয়োজন হলে type convert করে। === value এবং type দুটোই compare করে এবং type convert করে না। তাই === ব্যবহার করা বেশি safe।

4) What is the significance of async/await in fetching API data?
async ও await ব্যবহার করা হয় asynchronous API call সহজভাবে handle করার জন্য। এটি code readable করে এবং data আসা পর্যন্ত অপেক্ষা করতে সাহায্য করে।

5) Explain the concept of Scope in JavaScript (Global, Function, Block).
Scope মানে হলো variable কোথায় ব্যবহার করা যাবে।

Global Scope → পুরো program এ ব্যবহার করা যায়

Function Scope → শুধু function এর ভিতরে ব্যবহার করা যায়

Block Scope → { } block এর ভিতরে সীমাবদ্ধ থাকে
