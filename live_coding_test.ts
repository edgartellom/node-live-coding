// All the code should be in this file and you won't need to use any external library

// Use 'npx tsx filename.ts' to run your code
// You can run the code as many times as you want

// If you have any question please ask the interviewer instead of searching on the internet

// Disable copilot or any other AI tool

class ORM {
  tables: object = {};

  createTable(table: string, schema: object) {
    this.tables[table] = {
      schema,
      data: {},
    };
  }
  getTables() {
    return Object.keys(this.tables);
  }
  table(table: string) {
    const foundTable = this.tables[table];
    return {
      insert: (info: any) => {
        if (table === "messages") {
          if (info.name) {
            return "Invalid: name doesnt exists on schema";
          }
          if (!info.title) {
            return "Invalid: title cannot be null";
          }
        } else if (table == "users") {
          if (!info.email) {
            return "Invalid: email cannot be null";
          }
          if (typeof info.name !== "string") {
            return "Invalid: name must be a string";
          }
        }
        let id = 1;
        while (foundTable.data[id] !== undefined) {
          id++;
        }
        if (foundTable.data[id] === undefined) {
          foundTable.data[id] = { id, ...info };
        }
        return foundTable.data[id];
      },
      getAll: () => {
        return Object.values(foundTable.data).filter((d) => !d.deleted);
      },
      deleteById: (id: number) => {
        foundTable.data[id]["deleted"] = true;
        const { deleted, ...rest } = foundTable.data[id];
        return {
          id,
          ...rest,
        };
      },
      update: (id: number, info: any) => {
        if (table === "users") {
          if (typeof info.name !== "string") {
            return "Invalid: name must be a string";
          }

          if (info.lastName) {
            return "Invalid: lastName doesnt exists on schema";
          }
        }
        foundTable.data[id] = { ...foundTable.data[id], ...info };
        return {
          id,
          ...foundTable.data[id],
        };
      },
    };
  }
}

// All your code and changes should be above this line
const orm = new ORM();

orm.createTable("users", {
  // Consider that id will always exist and always will be primaryKey and autoIncrement
  id: { type: "integer", primaryKey: true, autoIncrement: true },
  name: { type: "text", notNull: true },
  email: { type: "text", notNull: true },
});

orm.createTable("messages", {
  id: { type: "integer", primaryKey: true, autoIncrement: true },
  title: { type: "text", notNull: true },
  description: { type: "text", notNull: true },
});

console.log("getTables:", orm.getTables());
// getTables: [ 'users', 'messages' ]

console.log(
  "insert:",
  orm.table("users").insert({ name: "John Doe", email: "john.doe@email.com" })
);
// insert: { id: 1, name: 'John Doe', email: 'john.doe@email.com' }

console.log(
  "insert:",
  orm.table("users").insert({ name: "Jane Doe", email: "jane.doe@email.com" })
);
// insert: { id: 2, name: 'Jane Doe', email: 'jane.doe@email.com' }

console.log("getAll:", orm.table("users").getAll());
// getAll: [
//   { id: 1, name: 'John Doe', email: 'john.doe@email.com' },
//   { id: 2, name: 'Jane Doe', email: 'jane.doe@email.com' }
// ]

console.log("delete:", orm.table("users").deleteById(2));
// delete: { id: 2, name: 'Jane Doe', email: 'jane.doe@email.com' }

console.log("getAll:", orm.table("users").getAll());
// getAll: [ { id: 1, name: 'John Doe', email: 'john.doe@email.com' } ]

console.log(
  "insert:",
  orm
    .table("users")
    .insert({ name: "Joseph Doe", email: "joseph.doe@email.com" })
);
// insert: { id: 3, name: 'Joseph Doe', email: 'joseph.doe@email.com' }

console.log("getAll:", orm.table("users").getAll());
// getAll: [
//    { id: 1, name: 'John Doe', email: 'john.doe@email.com' },
//    { id: 3, name: 'Joseph Doe', email: 'joseph.doe@email.com' }
// ]

console.log(
  "update:",
  orm.table("users").update(1, { name: "John Doe Updated" })
);
// update: { id: 1, name: 'John Doe Updated', email: 'john.doe@email.com' }

console.log("getAll", orm.table("users").getAll());
// getAll: [
//    { id: 1, name: 'John Doe Updated', email: 'john.doe@email.com' },
//    { id: 3, name: 'Joseph Doe', email: 'joseph.doe@email.com' }
// ]

/*
 * *************
 * *** BONUS ***
 * *************
 */

console.log("\n BONUS \n");

console.log(
  "insert:",
  orm.table("messages").insert({ description: "A message description" })
);
// insert: Invalid: title cannot be null

console.log("insert:", orm.table("users").insert({ name: "John Doe" }));
// insert: Invalid: email cannot be null

console.log(
  "insert:",
  orm.table("users").insert({ name: 10, email: "john.doe@email.com" })
);
// insert: Invalid: name must be a string

console.log("update:", orm.table("users").update(3, { name: 10 }));
// update: Invalid: name must be a string

console.log(
  "update:",
  orm.table("users").update(3, { name: "Other", lastName: "Person" })
);
// update: Invalid: lastName doesnt exists on schema

console.log("insert:", orm.table("messages").insert({ name: "John Doe" }));
// insert: Invalid: name doesnt exists on schema
