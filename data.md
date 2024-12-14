Set up Amplify Data
In this guide, you will learn how to set up Amplify Data. This includes building a real-time API and database using TypeScript to define your data model, and securing your API with authorization rules. We will also explore using AWS Lambda to scale to custom use cases.

Before you begin, you will need:

Node.js v18.16.0 or later
npm v6.14.4 or later
git v2.14.1 or later
With Amplify Data, you can build a secure, real-time API backed by a database in minutes. After you define your data model using TypeScript, Amplify will deploy a real-time API for you. This API is powered by AWS AppSync and connected to an Amazon DynamoDB database. You can secure your API with authorization rules and scale to custom use cases with AWS Lambda.

Building your data backend
If you've run npm create amplify@latest already, you should see an amplify/data/resource.ts file, which is the central location to configure your data backend. The most important element is the schema object, which defines your backend data models (a.model()) and custom queries (a.query()), mutations (a.mutation()), and subscriptions (a.subscription()).

amplify/data/resource.ts
import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({
  Todo: a.model({
      content: a.string(),
      isDone: a.boolean()
    })
    .authorization(allow => [allow.publicApiKey()])
});

// Used for code completion / highlighting when making requests from frontend
export type Schema = ClientSchema<typeof schema>;

// defines the data resource to be deployed
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: { expiresInDays: 30 }
  }
});
Every a.model() automatically creates the following resources in the cloud:

a DynamoDB database table to store records
query and mutation APIs to create, read (list/get), update, and delete records
createdAt and updatedAt fields that help you keep track of when each record was initially created or when it was last updated
real-time APIs to subscribe for create, update, and delete events of records
The allow.publicApiKey() rule designates that anyone authenticated using an API key can create, read, update, and delete todos.

To deploy these resources to your cloud sandbox, run the following CLI command in your terminal:

Terminal
npx ampx sandbox
Connect your application code to the data backend
Once the cloud sandbox is up and running, it will also create an amplify_outputs.json file, which includes the relevant connection information to your data backend, like your API endpoint URL and API key.

To connect your frontend code to your backend, you need to:

Configure the Amplify library with the Amplify client configuration file (amplify_outputs.json)
Generate a new API client from the Amplify library
Make an API request with end-to-end type-safety
First, install the Amplify client library to your project:

Terminal
npm add aws-amplify
In your app's entry point, typically main.ts for Vue apps created using Vite, make the following edits:

src/main.ts
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);
Write data to your backend
src/TodoList.vue
<script setup lang="ts">
import type { Schema } from '../../amplify/data/resource'
import { generateClient } from 'aws-amplify/data'

const client = generateClient<Schema>()

async function createTodo() {
  await client.models.Todo.create({
    content: window.prompt("Todo content?"),
    isDone: false
  })
}
</script>

<template>
  <div>
    <button @click="createTodo">Add new todo</button>
  </div>
</template>
Read data from your backend
Next, list all your todos and then refetch the todos after a todo has been added:

src/TodoList.vue
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Schema } from '../../amplify/data/resource'
import { generateClient } from 'aws-amplify/data'

const client = generateClient<Schema>()

// create a reactive reference to the array of todos
const todos = ref<Array<Schema['Todo']['type']>>([]);

function fetchTodos() {
  const { data: items, errors } = await client.models.Todo.list();
  todos.value = items; 
}

async function createTodo() {
  await client.models.Todo.create({
    content: window.prompt("Todo content?"),
    isDone: false
  })
  fetchTodos();
}

 onMounted(() => {
  fetchTodos();
});

</script>

<template>
  <div>
    <button @click="createTodo">Add new todo</button>
    <ul>
     <li 
       v-for="todo in todos" 
       :key="todo.id">
       {{ todo.content }}
     </li>
    </ul>
  </div>
</template>
Subscribe to real-time updates
src/TodoList.vue
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Schema } from '../../amplify/data/resource'
import { generateClient } from 'aws-amplify/data'

const client = generateClient<Schema>()

// create a reactive reference to the array of todos
const todos = ref<Array<Schema['Todo']["type"]>>([]);

function fetchTodos() {
  client.models.Todo.observeQuery().subscribe({
    next: ({ items, isSynced }) => {
      todos.value = items
     },
  }); 
}

async function createTodo() {
  await client.models.Todo.create({
    content: window.prompt("Todo content?"),
    isDone: false
  })
  // no more manual refetchTodos required!
  // - fetchTodos()
}

 onMounted(() => {
  fetchTodos();
});

</script>

<template>
  <div>
    <button @click="createTodo">Add new todo</button>
    <ul>
     <li 
       v-for="todo in todos" 
       :key="todo.id">
       {{ todo.content }}
     </li>
    </ul>
  </div>
</template>
Conclusion
Success! You've learned how to create your first real-time API and database with Amplify Data.

Connect your app code to API
In this guide, you will connect your application code to the backend API using the Amplify Libraries. Before you begin, you will need:

Your cloud sandbox with an Amplify Data resource up and running (npx ampx sandbox)
A frontend application set up with the Amplify library installed
npm installed
Configure the Amplify Library
When you deploy you're iterating on your backend (npx ampx sandbox), an amplify_outputs.json file is generated for you. This file contains your API's endpoint information and auth configurations. Add the following code to your app's entrypoint to initialize and configure the Amplify client library:

import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);
Generate the Amplify Data client
Once the Amplify library is configured, you can generate a "Data client" for your frontend code to make fully-typed API requests to your backend.

If you're using Amplify with a JavaScript-only frontend (i.e. not TypeScript), then you can still get a fully-typed data fetching experience by annotating the generated client with a JSDoc comment. Select the JavaScript in the code block below to see how.

To generate a new Data client, use the following code:

TypeScript
JavaScript
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource'; // Path to your backend resource definition

const client = generateClient<Schema>();

// Now you should be able to make CRUDL operations with the
// Data client
const fetchTodos = async () => {
  const { data: todos, errors } = await client.models.Todo.list();
};
Configure authorization mode
The Authorization Mode determines how a request should be authorized with the backend. By default, Amplify Data uses the "userPool" authorization which uses the signed-in user credentials to sign an API request. If you use a allow.publicApiKey() authorization rules for your data models, you need to use "apiKey" as an authorization mode. Review Customize your auth rules to learn more about which authorization modes to choose for which type of request. A Default Authorization Mode is provided as part of the amplify_outputs.json that is generated upon a successful deployment.

You can generate different Data clients with different authorization modes or pass in the authorization mode at the request time.

Set authorization mode on a per-client basis
To apply the same authorization mode on all requests from a Data client, specify the authMode parameter on the generateClient function.

API Key
Amazon Cognito user pool
AWS IAM (including Amazon Cognito identity pool roles)
OpenID Connect (OIDC)
Lambda Authorizer
Use "API Key" as your authorization mode when if defined the allow.publicApiKey() authorization rule.

import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource'; // Path to your backend resource definition

const client = generateClient<Schema>({
  authMode: 'apiKey',
});
Set authorization mode on the request-level
You can also specify the authorization mode on each individual API request. This is useful if your application typically only uses one authorization mode with a small number of exceptions.

API Key
Amazon Cognito user pool
AWS IAM (including Amazon Cognito identity pool roles)
OpenID Connect (OIDC)
Lambda Authorizer
const { data: todos, errors } = await client.models.Todo.list({
  authMode: 'apiKey',
});


const { data: todos, errors } = await client.models.Todo.list({
  authMode: 'apiKey',
});


or

const { data: todos, errors } = await client.models.Todo.list({
  authMode: 'userPool',
});



const { data: todos, errors } = await client.models.Todo.list({
  authMode: 'identityPool',
});



const { data: todos, errors } = await client.models.Todo.list({
  authMode: 'oidc',
});


or


You can implement your own custom API authorization logic using a AWS Lambda function. Review Customize your auth rules to learn more about how to implement your authorization protocol with AWS Lambda.

const getAuthToken = () => 'myAuthToken';
const lambdaAuthToken = getAuthToken();

const { data: todos, errors } = await client.models.Todo.list({
  authMode: 'lambda',
  authToken: lambdaAuthToken,
});






Set custom request headers
When working with the Amplify Data endpoint, you may need to set request headers for authorization purposes or to pass additional metadata from your frontend to the backend API.

This is done by specifying a headers parameter into the configuration. You can define headers either on a per Data client-level or on a per-request level:

Custom headers per Data client
Custom headers per request
import type { Schema } from '../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';

const client = generateClient<Schema>({
  headers: {
    'My-Custom-Header': 'my value',
  },
});
The examples above show you how to set static headers but you can also programmatically set headers by specifying an async function for headers:

Custom headers per Data client
Custom headers per request
import type { Schema } from '../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';

const client = generateClient<Schema>({
  headers: async (requestOptions) => {
    console.log(requestOptions);
    /* The request options allow you to customize your headers based on the request options such
       as http method, headers, request URI, and query string. These options are typically used
       to create a request signature.
    {
      method: '...',
      headers: { },
      uri: '/',
      queryString: ""
    }
    */
    return {
      'My-Custom-Header': 'my value',
    };
  },
});



reate, update, and delete application data
In this guide, you will learn how to create, update, and delete your data using Amplify Libraries' Data client.

Before you begin, you will need:

An application connected to the API
Create an item
You can create an item by first generating the Data client with your backend Data schema. Then you can add an item:

import { generateClient } from 'aws-amplify/data';
import { type Schema } from '../amplify/data/resource'

const client = generateClient<Schema>();

const { errors, data: newTodo } = await client.models.Todo.create({
  content: "My new todo",
  isDone: true,
})
Note: You do not need to specify createdAt or updatedAt fields because Amplify automatically populates these fields for you.

Update an item
To update the item, use the update function:

import { generateClient } from 'aws-amplify/data';
import { type Schema } from '../amplify/data/resource';

const client = generateClient<Schema>();

const todo = {
  id: 'some_id',
  content: 'Updated content',
};

const { data: updatedTodo, errors } = await client.models.Todo.update(todo);
Notes:

You do not need to specify the updatedAt field. Amplify will automatically populate this field for you.
If you specify extra input fields not expected by the API, this query will fail. You can see this in the errors field returned by the query. With Amplify Data, errors are not thrown like exceptions. Instead, any errors are captured and returned as part of the query result in the errors field.
Delete an item
You can then delete the Todo by using the delete mutation. To specify which item to delete, you only need to provide the id of that item:

import { generateClient } from 'aws-amplify/data';
import { type Schema } from '../amplify/data/resource'

const client = generateClient<Schema>();

const toBeDeletedTodo = {
  id: '123123213'
}

const { data: deletedTodo, errors } = await client.models.Todo.delete(toBeDeletedTodo)
Note: When deleting items in many-to-many relationships, the join table records must be deleted before deleting the associated records. For example, for a many-to-many relationship between Posts and Tags, delete the PostTags join record before deleting a Post or Tag. Review Many-to-many relationships for more details.

Troubleshooting
Troubleshoot unauthorized errors
Cancel create, update, and delete requests
You can cancel any mutation API request by calling .cancel on the mutation request promise that's returned by .create(...), .update(...), or .delete(...).

const promise = client.models.Todo.create({ content: 'New Todo' });
//  ^ Note: we're not awaiting the request, we're returning the promise

try {
  await promise;
} catch (error) {
  console.log(error);
  // If the error is because the request was cancelled you can confirm here.
  if (client.isCancelError(error)) {
    console.log(error.message); // "my message for cancellation"
    // handle user cancellation logic
  }
}

//...

// To cancel the above request
client.cancel(promise, 'my message for cancellation');
You need to ensure that the promise returned from .create(), .update(), and .delete() has not been modified. Typically, async functions wrap the promise being returned into another promise. For example, the following will not work:

async function makeAPICall() {
  return client.models.Todo.create({ content: 'New Todo' });
}
const promise = makeAPICall();

// The following will NOT cancel the request.
client.cancel(promise, 'my error message');
Conclusion
Congratulations! You have finished the Create, update, and delete application data guide. In this guide, you created, updated, and deleted your app data.



Read application data
You can read application data using the Amplify Data client. In this guide, we will review the difference between reading data and getting data, how to filter query results to get just the data you need, and how to paginate results to make your data more manageable. We will also show you how to cancel these requests when needed.

Before you begin, you will need:

An application connected to the API
Data already created to view
List and get your data
Queries are used to read data through the API and include the list and get operations. Amplify Data automatically creates list and get queries for any a.model() type in your schema. The list query retrieves multiple items, such as Todo items, without needing to specific an identifier for a particular record. This is best suited for getting an overview or summary of items, or for enhancing the list operation to filter the items by specific criteria. When you want to query a single entry by an identifier, you would use get to retrieve a specific Todo item.

Note: The cost structure of your underlying data source can impact the cost to run some queries. For example, the list operation uses Amazon DynamoDB "scan operations," which can use more read request units than the get operation. You will want to review the associated costs for these operations for your data source. In our example, we are using DynamoDB. You can learn more about how DynamoDB costs are calculated by visiting Amazon DynamoDB pricing.

You can list items by first generating the Data client with your backend Data schema. Then you can list items of your desired model:

import { generateClient } from 'aws-amplify/data';
import { type Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

// list all items
const { data: todos, errors } = await client.models.Todo.list();

// get a specific item
const { data: todo, errors } = await client.models.Todo.get({
  id: '...',
});
Troubleshooting
Troubleshoot unauthorized errors
Filter list queries
As your data grows, you will need to paginate your list queries. Fortunately, this is already built in to Amplify Data.

import { generateClient } from 'aws-amplify/data';
import { type Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

const { data: todos, errors } = await client.models.Todo.list({
  filter: {
    content: {
      beginsWith: 'hello'
    }
  }
});
Compound filters
You can combine filters with and, or, and not Boolean logic. Observe that filter is recursive in respect to those fields. So if, for example, you wanted to filter for priority values of 1 or 2, you would do this:

import { generateClient } from 'aws-amplify/data';
import { type Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

const { data: todos, errors } = await client.models.Todo.list({
  filter: {
    or: [
      {
        priority: { eq: '1' }
      },
      {
        priority: { eq: '2' }
      }
    ]
  }
});
Note that querying for priority of 1 and 2 would return no results, because this is Boolean logic instead of natural language.

Paginate list queries
To paginate your list query results, make a subsequent list query request with the nextToken and limit input variable set. The limit variable limits how many results are returned. The response will include a nextToken you can use to request the next page of data. A nextToken is a very long string that represents the cursor to the starting item of the next query made with these filters.

import { generateClient } from 'aws-amplify/data';
import { type Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

const {
  data: todos,
  nextToken, // Repeat this API call with the nextToken until the returned nextToken is `null`
  errors
} = await client.models.Todo.list({
  limit: 100, // default value is 100
  nextToken: 'eyJ2ZXJzaW9uejE1a2...' // previous nextToken
});
If you're building a React application, you can use the usePagination hook in Amplify UI to help with managing the pagination user experience.

import * as React from 'react';
import { Pagination } from '@aws-amplify/ui-react';

export const PaginationHasMorePagesExample = () => {
  const [pageTokens, setPageTokens] = React.useState([null]);
  const [currentPageIndex, setCurrentPageIndex] = React.useState(1);
  const [hasMorePages, setHasMorePages] = React.useState(true);

  const handleNextPage = async () => {
    if (hasMorePages && currentPageIndex === pageTokens.length) {
      const { data: todos, nextToken } = await client.models.Todo.list({
        nextToken: pageTokens[pageTokens.length - 1]
      });

      if (!nextToken) {
        setHasMorePages(false);
      }

      setPageTokens([...pageTokens, nextToken]);
    }

    setCurrentPageIndex(currentPageIndex + 1);
  };

  return (
    <Pagination
      currentPage={currentPageIndex}
      totalPages={pageTokens.length}
      hasMorePages={hasMorePages}
      onNext={handleNextPage}
      onPrevious={() => setCurrentPageIndex(currentPageIndex - 1)}
      onChange={(pageIndex) => setCurrentPageIndex(pageIndex)}
    />
  );
};
Limitations:

There is no API to get a total page count at this time. Note that scanning all items is a potentially expensive operation.
You cannot query by page number; you have to query by nextToken.
Fetch only the data you need with custom selection set
A business domain model may contain many models with numerous fields. However, apps typically only need subsets of the data or fields to meet the requirements of different components or screens. It is necessary to have a mechanism to retrieve subsets of models and their relationships. This mechanism would help optimize data usage for screens and components by only transferring needed data. Having this capability would improve the app's data efficiency, latency, and the end user's perceived performance.

A custom selection set allows consumers to specify, on a per-call basis, the fields the consumer wants to retrieve; this is possible for all operations that return data (CRUDL + observeQuery). The desired fields are specified in a strongly typed way (discoverable through IntelliSense) with a "dot notation".

// same way for all CRUDL: .create, .get, .update, .delete, .list, .observeQuery
const { data: blogWithSubsetOfData, errors } = await client.models.Blog.get(
  { id: blog.id },
  {
    selectionSet: ['author.email', 'posts.*'],
  }
);
TypeScript type helpers for Amplify Data
When using TypeScript, you frequently need to specify data model types for type generics. For instance, with React's useState, you provide a type in TypeScript to ensure type-safety in your component code using the state. Use the Schema["MODEL_NAME"]["type"] pattern to get TypeScript types for the shapes of data models returned from the backend API. This allows you to get consumable TypeScript types for the shapes of the data model return values coming from the backend API.

import { type Schema } from '@/amplify/data/resource';

type Post = Schema['Post']['type'];

const [posts, setPosts] = useState<Post[]>([]);
You can combine the Schema["MODEL_NAME"]["type"] type with the SelectionSet helper type to describe the return type of API requests using the selectionSet parameter:

import type { SelectionSet } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';


const selectionSet = ['content', 'blog.author.*', 'comments.*'] as const;
type PostWithComments = SelectionSet<Schema['Post']['type'], typeof selectionSet>;

// ...
const [posts, setPosts] = useState<PostWithComments[]>([]);

const fetchPosts = async () => {
  const { data: postsWithComments } = await client.models.Post.list({
    selectionSet,
  });
  setPosts(postsWithComments);
}
Cancel read requests
You can cancel any query API request by calling .cancel on the query request promise that's returned by .list(...) or .get(...).

const promise = client.models.Todo.list();
//  ^ Note: we're not awaiting the request, we're returning the promise

try {
  await promise;
} catch (error) {
  console.log(error);
  // If the error is because the request was cancelled you can confirm here.
  if (client.isCancelError(error)) {
    console.log(error.message); // "my message for cancellation"
    // handle user cancellation logic
  }
}
...

// To cancel the above request
client.cancel(promise, "my message for cancellation");
You need to ensure that the promise returned from .list() or .get() has not been modified. Typically, async functions wrap the promise being returned into another promise. For example, the following will not work:

async function makeAPICall() {
  return client.models.Todo.list();
}
const promise = makeAPICall();

// The following will NOT cancel the request.
client.cancel(promise, 'my error message');
Conclusion
Congratulations! You have finished the Read application data guide. In this guide, you learned how to read your data through get and list queries.

Subscribe to real-time events
In this guide, we will outline the benefits of enabling real-time data integrations and how to set up and filter these subscriptions. We will also cover how to unsubscribe from subscriptions.

Before you begin, you will need:

An application connected to the API
Data already created to modify
With Amplify Data Construct @aws-amplify/data-construct@1.8.4, an improvement was made to how relational field data is handled in subscriptions when different authorization rules apply to related models in a schema. The improvement redacts the values for the relational fields, displaying them as null or empty, to prevent unauthorized access to relational data.

This redaction occurs whenever it cannot be determined that the child model will be protected by the same permissions as the parent model.

Because subscriptions are tied to mutations and the selection set provided in the result of a mutation is then passed through to the subscription, relational fields in the result of mutations must be redacted.

If an authorized end-user needs access to the redacted relational fields, they should perform a query to read the relational data.

Additionally, subscriptions will inherit related authorization when relational fields are set as required. To better protect relational data, consider modifying the schema to use optional relational fields.

Set up a real-time list query
The recommended way to fetch a list of data is to use observeQuery to get a real-time list of your app data at all times. You can integrate observeQuery with React's useState and useEffect hooks in the following way:

import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';

type Todo = Schema['Todo']['type'];

const client = generateClient<Schema>();

export default function MyComponent() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const sub = client.models.Todo.observeQuery().subscribe({
      next: ({ items, isSynced }) => {
        setTodos([...items]);
      },
    });
    return () => sub.unsubscribe();
  }, []);

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.content}</li>
      ))}
    </ul>
  );
}
observeQuery fetches and paginates through all of your available data in the cloud. While data is syncing from the cloud, snapshots will contain all of the items synced so far and an isSynced status of false. When the sync process is complete, a snapshot will be emitted with all the records in the local store and an isSynced status of true.

Troubleshooting
Missing real-time events and model fields
Set up a real-time event subscription
Subscriptions is a feature that allows the server to send data to its clients when a specific event happens. For example, you can subscribe to an event when a new record is created, updated, or deleted through the API. Subscriptions are automatically available for any a.model() in your Amplify Data schema.

import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';

const client = generateClient<Schema>();

// Subscribe to creation of Todo
const createSub = client.models.Todo.onCreate().subscribe({
  next: (data) => console.log(data),
  error: (error) => console.warn(error),
});

// Subscribe to update of Todo
const updateSub = client.models.Todo.onUpdate().subscribe({
  next: (data) => console.log(data),
  error: (error) => console.warn(error),
});

// Subscribe to deletion of Todo
const deleteSub = client.models.Todo.onDelete().subscribe({
  next: (data) => console.log(data),
  error: (error) => console.warn(error),
});

// Stop receiving data updates from the subscription
createSub.unsubscribe();
updateSub.unsubscribe();
deleteSub.unsubscribe();
Set up server-side subscription filters
Subscriptions take an optional filter argument to define service-side subscription filters:

import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';

const client = generateClient<Schema>();

const sub = client.models.Todo.onCreate({
  filter: {
    content: {
      contains: 'groceries',
    },
  },
}).subscribe({
  next: (data) => console.log(data),
  error: (error) => console.warn(error),
});
If you want to get all subscription events, don't specify any filter parameters.

Limitations:

Specifying an empty object {} as a filter is not recommended. Using {} as a filter might cause inconsistent behavior based on your data model's authorization rules.
If you're using dynamic group authorization and you authorize based on a single group per record, subscriptions are only supported if the user is part of five or fewer user groups.
Additionally, if you authorize by using an array of groups (groups: [String]),
subscriptions are only supported if the user is part of 20 or fewer groups
you can only authorize 20 or fewer user groups per record
Subscription connection status updates
Now that your application is set up and using subscriptions, you may want to know when the subscription is finally established, or reflect to your users when the subscription isn't healthy. You can monitor the connection state for changes through the Hub local eventing system.

import { CONNECTION_STATE_CHANGE, ConnectionState } from 'aws-amplify/data';
import { Hub } from 'aws-amplify/utils';

Hub.listen('api', (data: any) => {
  const { payload } = data;
  if (payload.event === CONNECTION_STATE_CHANGE) {
    const connectionState = payload.data.connectionState as ConnectionState;
    console.log(connectionState);
  }
});
Subscription connection states
Connected - Connected and working with no issues.
ConnectedPendingDisconnect - The connection has no active subscriptions and is disconnecting.
ConnectedPendingKeepAlive - The connection is open, but has missed expected keep-alive messages.
ConnectedPendingNetwork - The connection is open, but the network connection has been disrupted. When the network recovers, the connection will continue serving traffic.
Connecting - Attempting to connect.
ConnectionDisrupted - The connection is disrupted and the network is available.
ConnectionDisruptedPendingNetwork - The connection is disrupted and the network connection is unavailable.
Disconnected - Connection has no active subscriptions and is disconnecting.
Troubleshooting
Troubleshoot connection issues and automated reconnection
Unsubscribe from a subscription
You can also unsubscribe from events by using subscriptions by implementing the following:

// Stop receiving data updates from the subscription
sub.unsubscribe();
Conclusion
Congratulations! You have finished the Subscribe to real-time events guide. In this guide, you set up subscriptions for real-time events and learned how to filter and cancel these subscriptions when needed.

ustomize your data model
Data modeling capabilities
Every data model is defined as part of a data schema (a.schema()). You can enhance your data model with various fields, customize their identifiers, apply authorization rules, or model relationships. Every data model (a.model()) automatically provides create, read, update, and delete API operations as well as real-time subscription events. Below is a quick tour of the many functionalities you can add to your data model:

import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a
  .schema({
    Customer: a
      .model({
        customerId: a.id().required(),
        // fields can be of various scalar types,
        // such as string, boolean, float, integers etc.
        name: a.string(),
        // fields can be of custom types
        location: a.customType({
          // fields can be required or optional
          lat: a.float().required(),
          long: a.float().required(),
        }),
        // fields can be enums
        engagementStage: a.enum(["PROSPECT", "INTERESTED", "PURCHASED"]),
        collectionId: a.id(),
        collection: a.belongsTo("Collection", "collectionId")
        // Use custom identifiers. By default, it uses an `id: a.id()` field
      })
      .identifier(["customerId"]),
    Collection: a
      .model({
        customers: a.hasMany("Customer", "collectionId"), // setup relationships between types
        tags: a.string().array(), // fields can be arrays
        representativeId: a.id().required(),
        // customize secondary indexes to optimize your query performance
      })
      .secondaryIndexes((index) => [index("representativeId")]),
  })
  .authorization((allow) => [allow.publicApiKey()]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});


odeling relationships
When modeling application data, you often need to establish relationships between different data models. In Amplify Data, you can create one-to-many, one-to-one, and many-to-many relationships in your Data schema. On the client-side, Amplify Data allows you to lazy or eager load of related data.

With Amplify Data Construct @aws-amplify/data-construct@1.8.4, an improvement was made to how relational field data is handled in subscriptions when different authorization rules apply to related models in a schema. The improvement redacts the values for the relational fields, displaying them as null or empty, to prevent unauthorized access to relational data.

This redaction occurs whenever it cannot be determined that the child model will be protected by the same permissions as the parent model.

Because subscriptions are tied to mutations and the selection set provided in the result of a mutation is then passed through to the subscription, relational fields in the result of mutations must be redacted.

If an authorized end-user needs access to the redacted relational fields, they should perform a query to read the relational data.

Additionally, subscriptions will inherit related authorization when relational fields are set as required. To better protect relational data, consider modifying the schema to use optional relational fields.

Types of relationships
Relationship	Code	Description	Example
one to many	a.hasMany(...) & a.belongsTo(...)	Creates a one-to-many relationship between two models.	A Team has many Members. A Member belongs to a Team.
one to one	a.hasOne(...) & a.belongsTo(...)	Creates a one-to-one relationship between two models.	A Customer has one Cart. A Cart belongs to one Customer.
many to many	Two a.hasMany(...) & a.belongsTo(...) on join tables	Create two one-to-many relationships between the related models in a join table.	A Post has many Tags. A Tag has many Posts.
Model one-to-many relationships
Create a one-to-many relationship between two models using the hasMany() and belongsTo() method. In the example below, a Team has many Members and a Member belongs to exactly one Team.

Create a reference field called teamId on the Member model. This reference field's type MUST match the type of Team's identifier. In this case, it's an auto-generated id: a.id().required() field.
Add a relationship field called team that references the teamId field. This allows you to query for the team information from the Member model.
Add a relationship field called members that references the teamId field on the Member model.
const schema = a.schema({
  Member: a.model({
    name: a.string().required(),
    // 1. Create a reference field
    teamId: a.id(),
    // 2. Create a belongsTo relationship with the reference field
    team: a.belongsTo('Team', 'teamId'),
  }),

  Team: a.model({
    mantra: a.string().required(),
    // 3. Create a hasMany relationship with the reference field
    //    from the `Member`s model.
    members: a.hasMany('Member', 'teamId'),
  }),
}).authorization((allow) => allow.publicApiKey());
Create a "Has Many" relationship between records
const { data: team } = await client.models.Team.create({
  mantra: 'Go Frontend!',
});

const { data: member } = await client.models.Member.create({
  name: "Tim",
  teamId: team.id,
});
Update a "Has Many" relationship between records
const { data: newTeam } = await client.models.Team.create({
  mantra: 'Go Fullstack',
});

await client.models.Member.update({
  id: "MY_MEMBER_ID",
  teamId: newTeam.id,
});
Delete a "Has Many" relationship between records
If your reference field is not required, then you can "delete" a one-to-many relationship by setting the relationship value to null.

await client.models.Member.update({
  id: "MY_MEMBER_ID",
  teamId: null,
});
Lazy load a "Has Many" relationship
const { data: team } = await client.models.Team.get({ id: "MY_TEAM_ID"});

const { data: members } = await team.members();

members.forEach(member => console.log(member.id));
Eagerly load a "Has Many" relationship
const { data: teamWithMembers } = await client.models.Team.get(
  { id: "MY_TEAM_ID" },
  { selectionSet: ["id", "members.*"] },
);

teamWithMembers.members.forEach(member => console.log(member.id));
Model a "one-to-one" relationship
Create a one-to-one relationship between two models using the hasOne() and belongsTo() methods. In the example below, a Customer has a Cart and a Cart belongs to a Customer.

Create a reference field called customerId on the Cart model. This reference field's type MUST match the type of Customer's identifier. In this case, it's an auto-generated id: a.id().required() field.
Add a relationship field called customer that references the customerId field. This allows you to query for the customer information from the Cart model.
Add a relationship field called activeCart that references the customerId field on the Cart model.
const schema = a.schema({
  Cart: a.model({
    items: a.string().required().array(),
    // 1. Create reference field
    customerId: a.id(),
    // 2. Create relationship field with the reference field
    customer: a.belongsTo('Customer', 'customerId'),
  }),
  Customer: a.model({
    name: a.string(),
    // 3. Create relationship field with the reference field
    //    from the Cart model
    activeCart: a.hasOne('Cart', 'customerId')
  }),
}).authorization((allow) => allow.publicApiKey());
Create a "Has One" relationship between records
To create a "has one" relationship between records, first create the parent item and then create the child item and assign the parent.

const { data: customer, errors } = await client.models.Customer.create({
  name: "Rene",
});


const { data: cart } = await client.models.Cart.create({
  items: ["Tomato", "Ice", "Mint"],
  customerId: customer?.id,
});
Update a "Has One" relationship between records
To update a "Has One" relationship between records, you first retrieve the child item and then update the reference to the parent to another parent. For example, to reassign a Cart to another Customer:

const { data: newCustomer } = await client.models.Customer.create({
  name: 'Ian',
});

await client.models.Cart.update({
  id: cart.id,
  customerId: newCustomer?.id,
});
Delete a "Has One" relationship between records
You can set the relationship field to null to delete a "Has One" relationship between records.

await client.models.Cart.update({
  id: project.id,
  customerId: null,
});
Lazy load a "Has One" relationship
const { data: cart } = await client.models.Cart.get({ id: "MY_CART_ID"});
const { data: customer } = await cart.customer();
Eagerly load a "Has One" relationship
const { data: cart } = await client.models.Cart.get(
  { id: "MY_CART_ID" },
  { selectionSet: ['id', 'customer.*'] },
);

console.log(cart.customer.id)
Model a "many-to-many" relationship
In order to create a many-to-many relationship between two models, you have to create a model that serves as a "join table". This "join table" should contain two one-to-many relationships between the two related entities. For example, to model a Post that has many Tags and a Tag has many Posts, you'll need to create a new PostTag model that represents the relationship between these two entities.

const schema = a.schema({
  PostTag: a.model({
    // 1. Create reference fields to both ends of
    //    the many-to-many relationship
    postId: a.id().required(),
    tagId: a.id().required(),
    // 2. Create relationship fields to both ends of
    //    the many-to-many relationship using their
    //    respective reference fields
    post: a.belongsTo('Post', 'postId'),
    tag: a.belongsTo('Tag', 'tagId'),
  }),
  Post: a.model({
    title: a.string(),
    content: a.string(),
    // 3. Add relationship field to the join model
    //    with the reference of `postId`
    tags: a.hasMany('PostTag', 'postId'),
  }),
  Tag: a.model({
    name: a.string(),
    // 4. Add relationship field to the join model
    //    with the reference of `tagId`
    posts: a.hasMany('PostTag', 'tagId'),
  }),
}).authorization((allow) => allow.publicApiKey());
Model multiple relationships between two models
Relationships are defined uniquely by their reference fields. For example, a Post can have separate relationships with a Person model for author and editor.

const schema = a.schema({
  Post: a.model({
    title: a.string().required(),
    content: a.string().required(),
    authorId: a.id(),
    author: a.belongsTo('Person', 'authorId'),
    editorId: a.id(),
    editor: a.belongsTo('Person', 'editorId'),
  }),
  Person: a.model({
    name: a.string(),
    editedPosts: a.hasMany('Post', 'editorId'),
    authoredPosts: a.hasMany('Post', 'authorId'),
  }),
}).authorization((allow) => allow.publicApiKey());
On the client-side, you can fetch the related data with the following code:

const client = generateClient<Schema>();

const { data: post } = await client.models.Post.get({ id: "SOME_POST_ID" });

const { data: author } = await post?.author();
const { data: editor } = await post?.editor();
Model relationships for models with sort keys in their identifier
In cases where your data model uses sort keys in the identifier, you need to also add reference fields and store the sort key fields in the related data model:

const schema = a.schema({
  Post: a.model({
    title: a.string().required(),
    content: a.string().required(),
    // Reference fields must correspond to identifier fields.
    authorName: a.string(),
    authorDoB: a.date(),
    // Must pass references in the same order as identifiers.
    author: a.belongsTo('Person', ['authorName', 'authorDoB']),
  }),
  Person: a.model({
    name: a.string().required(),
    dateOfBirth: a.date().required(),
    // Must reference all reference fields corresponding to the
    // identifier of this model.
    authoredPosts: a.hasMany('Post', ['authorName', 'authorDoB']),
  }).identifier(['name', 'dateOfBirth']),
}).authorization((allow) => allow.publicApiKey());
Make relationships required or optional
Amplify Data's relationships use reference fields to determine if a relationship is required or not. If you mark a reference field as required, then you can't "delete" a relationship between two models. You'd have to delete the related record as a whole.

const schema = a.schema({
  Post: a.model({
    title: a.string().required(),
    content: a.string().required(),
    // You must supply an author when creating the post
    // Author can't be set to `null`.
    authorId: a.id().required(),
    author: a.belongsTo('Person', 'authorId'),
    // You can optionally supply an editor when creating the post.
    // Editor can also be set to `null`.
    editorId: a.id(),
    editor: a.belongsTo('Person', 'editorId'),
  }),
  Person: a.model({
    name: a.string(),
    editedPosts: a.hasMany('Post', 'editorId'),
    authoredPosts: a.hasMany('Post', 'authorId'),
  }),
}).authorization((allow) => allow.publicApiKey());


Customize data model identifiers
Identifiers are defined using the .identifier() method on a model definition. Usage of the .identifier() method is optional; when it's not present, the model will automatically have a field called id of type ID that is automatically generated unless manually specified.

const schema = a.schema({
  Todo: a.model({
    content: a.string(),
    completed: a.boolean(),
  })
  .authorization(allow => [allow.publicApiKey()]),
});
const client = generateClient<Schema>();

const todo = await client.models.Todo.create({ content: 'Buy Milk', completed: false });
console.log(`New Todo created: ${todo.id}`); // New Todo created: 5DB6B4CC-CD41-49F5-9844-57C0AB506B69
If you want, you can use Amplify Data to define single-field and composite identifiers:

Single-field identifier with a consumer-provided value (type: id or string, and must be marked required)
Composite identifier with a set of consumer-provided values (type: id or string, and must be marked required)
Single-field identifier
If the default id identifier field needs to be customized, you can do so by passing the name of another field.

const schema = a.schema({
  Todo: a.model({
    todoId: a.id().required(),
    content: a.string(),
    completed: a.boolean(),
  })
  .identifier(['todoId'])
  .authorization(allow => [allow.publicApiKey()]),
});
const client = generateClient<Schema>();

const { data: todo, errors } = await client.models.Todo.create({ todoId: 'MyUniqueTodoId', content: 'Buy Milk', completed: false });
console.log(`New Todo created: ${todo.todoId}`); // New Todo created: MyUniqueTodoId
Composite identifier
For cases where items are uniquely identified by more than a single field, you can pass an array of the field names to the identifier() function:

const schema = a.schema({
  StoreBranch: a.model({
    geoId: a.id().required(),
    name: a.string().required(),
    country: a.string(),
    state: a.string(),
    city: a.string(),
    zipCode: a.string(),
    streetAddress: a.string(),
  }).identifier(['geoId', 'name'])
  .authorization(allow => [allow.publicApiKey()]),
});
const client = generateClient<Schema>();

const branch = await client.models.StoreBranch.get({ geoId: '123', name: 'Downtown' }); // All identifier fields are required when retrieving an item

Customize secondary indexes
You can optimize your list queries based on "secondary indexes". For example, if you have a Customer model, you can query based on the customer's id identifier field by default but you can add a secondary index based on the accountRepresentativeId to get list customers for a given account representative.

A secondary index consists of a "hash key" and, optionally, a "sort key". Use the "hash key" to perform strict equality and the "sort key" for greater than (gt), greater than or equal to (ge), less than (lt), less than or equal to (le), equals (eq), begins with, and between operations.

amplify/data/resource.ts
export const schema = a.schema({
  Customer: a
    .model({
      name: a.string(),
      phoneNumber: a.phone(),
      accountRepresentativeId: a.id().required(),
    })
    .secondaryIndexes((index) => [index("accountRepresentativeId")])
    .authorization(allow => [allow.publicApiKey()]),
});
The example client query below allows you to query for "Customer" records based on their accountRepresentativeId:

src/App.tsx
import { type Schema } from '../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';

const client = generateClient<Schema>();

const { data, errors } =
  await client.models.Customer.listCustomerByAccountRepresentativeId({
    accountRepresentativeId: "YOUR_REP_ID",
  });
Review how this works under the hood with Amazon DynamoDB
Add sort keys to secondary indexes
You can define "sort keys" to add a set of flexible filters to your query, such as "greater than" (gt), "greater than or equal to" (ge), "less than" (lt), "less than or equal to" (le), "equals" (eq), "begins with" (beginsWith), and "between" operations.

amplify/data/resource.ts
export const schema = a.schema({
  Customer: a
    .model({
      name: a.string(),
      phoneNumber: a.phone(),
      accountRepresentativeId: a.id().required(),
    })
    .secondaryIndexes((index) => [
      index("accountRepresentativeId")
        .sortKeys(["name"]),
    ])
    .authorization(allow => [allow.owner()]),
});
On the client side, you should find a new listBy... query that's named after hash key and sort keys. For example, in this case: listByAccountRepresentativeIdAndName. You can supply the filter as part of this new list query:

src/App.tsx
const { data, errors } =
  await client.models.Customer.listCustomerByAccountRepresentativeIdAndName({
    accountRepresentativeId: "YOUR_REP_ID",
    name: {
      beginsWith: "Rene",
    },
  });
Customize the query field for secondary indexes
You can also customize the auto-generated query name under client.models.<MODEL_NAME>.listBy... by setting the queryField() modifier.

amplify/data/resource.ts
const schema = a.schema({
  Customer: a
    .model({
      name: a.string(),
      phoneNumber: a.phone(),
      accountRepresentativeId: a.id().required(),
    })
    .secondaryIndexes((index) => [
      index("accountRepresentativeId")
        .queryField("listByRep"),
    ])
    .authorization(allow => [allow.owner()]),
});
In your client app code, you'll see query updated under the Data client:

src/App.tsx
const {
  data,
  errors
} = await client.models.Customer.listByRep({
  accountRepresentativeId: 'YOUR_REP_ID',
})
Customize the name of secondary indexes
To customize the underlying DynamoDB's index name, you can optionally provide the name() modifier.

amplify/data/resource.ts
const schema = a.schema({
  Customer: a
    .model({
      name: a.string(),
      phoneNumber: a.phone(),
      accountRepresentativeId: a.id().required(),
    })
    .secondaryIndexes((index) => [
      index("accountRepresentativeId")
        .name("MyCustomIndexName"),
    ])
    .authorization(allow => [allow.owner()]),
});
PREVIOUS    


Vue
/
Build & connect backend
/
Data
/
Optimistic UI
Optimistic UI
Amplify Data can be used with TanStack Query to implement optimistic UI, allowing CRUD operations to be rendered immediately on the UI before the request roundtrip has completed. Using Amplify Data with TanStack additionally makes it easy to render loading and error states, and allows you to rollback changes on the UI when API calls are unsuccessful.

In the following examples we'll create a list view that optimistically renders newly created items, and a detail view that optimistically renders updates and deletes.

For more details on TanStack Query, including requirements, supported browsers, and advanced usage, see the TanStack Query documentation. For complete guidance on how to implement optimistic updates with TanStack Query, see the TanStack Query Optimistic UI Documentation. For more on Amplify Data, see the API documentation.

To get started, run the following command in an existing Amplify project with a React frontend:

Terminal
# Install TanStack Query
npm i @tanstack/react-query @tanstack/react-query-devtools
Modify your Data schema to use this "Real Estate Property" example:

amplify/data/resource.ts
const schema = a.schema({
  RealEstateProperty: a.model({
    name: a.string().required(),
    address: a.string(),
  }).authorization(allow => [allow.guest()])
})

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'iam',
  },
});
Save the file and run npx ampx sandbox to deploy the changes to your backend cloud sandbox. For the purposes of this guide, we'll build a Real Estate Property listing application.

Next, at the root of your project, add the required TanStack Query imports, and create a client:

src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Amplify } from 'aws-amplify'
import outputs from '../amplify_outputs.json'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

Amplify.configure(outputs)

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
)
TanStack Query Devtools are not required, but are a useful resource for debugging and understanding how TanStack works under the hood. By default, React Query Devtools are only included in bundles when process.env.NODE_ENV === 'development', meaning that no additional configuration is required to exclude them from a production build. For more information on the TanStack Query Devtools, visit the TanStack Query Devtools docs

For the complete working example, including required imports and React component state management, see the Complete Example below.

How to use TanStack Query query keys with the Amplify Data API
TanStack Query manages query caching based on the query keys you specify. A query key must be an array. The array can contain a single string or multiple strings and nested objects. The query key must be serializable, and unique to the query's data.

When using TanStack to render optimistic UI with Amplify Data, you must use different query keys depending on the API operation. When retrieving a list of items, a single string is used (e.g. queryKey: ["realEstateProperties"]). This query key is also used to optimistically render a newly created item. When updating or deleting an item, the query key must also include the unique identifier for the record being deleted or updated (e.g. queryKey: ["realEstateProperties", newRealEstateProperty.id]).

For more detailed information on query keys, see the TanStack Query documentation.

Optimistically rendering a list of records
To optimistically render a list of items returned from the Amplify Data API, use the TanStack useQuery hook, passing in the Data API query as the queryFn parameter. The following example creates a query to retrieve all records from the API. We'll use realEstateProperties as the query key, which will be the same key we use to optimistically render a newly created item.

src/App.tsx
import type { Schema } from '../amplify/data/resource'
import { generateClient } from 'aws-amplify/data'
import { useQuery } from '@tanstack/react-query'

const client = generateClient<Schema>();

function App() {
  const {
    data: realEstateProperties,
    isLoading,
    isSuccess,
    isError: isErrorQuery,
  } = useQuery({
    queryKey: ["realEstateProperties"],
    queryFn: async () => {
      const response = await client.models.RealEstateProperty.list();

      const allRealEstateProperties = response.data;

      if (!allRealEstateProperties) return null;

      return allRealEstateProperties;
    },
  });
  // return ...
}
Optimistically rendering a newly created record
To optimistically render a newly created record returned from the Amplify Data API, use the TanStack useMutation hook, passing in the Amplify Data API mutation as the mutationFn parameter. We'll use the same query key used by the useQuery hook (realEstateProperties) as the query key to optimistically render a newly created item. We'll use the onMutate function to update the cache directly, as well as the onError function to rollback changes when a request fails.

import { generateClient } from 'aws-amplify/api'
import type { Schema } from '../amplify/data/resource'
import { useQueryClient, useMutation } from '@tanstack/react-query'

const client = generateClient<Schema>()

function App() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (input: { name: string, address: string }) => {
      const { data: newRealEstateProperty } = await client.models.RealEstateProperty.create(input)
      return newRealEstateProperty;
    },
    // When mutate is called:
    onMutate: async (newRealEstateProperty) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["realEstateProperties"] });

      // Snapshot the previous value
      const previousRealEstateProperties = queryClient.getQueryData([
        "realEstateProperties",
      ]);

      // Optimistically update to the new value
      if (previousRealEstateProperties) {
        queryClient.setQueryData(["realEstateProperties"], (old: Schema["RealEstateProperty"]["type"][]) => [
          ...old,
          newRealEstateProperty,
        ]);
      }

      // Return a context object with the snapshotted value
      return { previousRealEstateProperties };
    },
    // If the mutation fails,
    // use the context returned from onMutate to rollback
    onError: (err, newRealEstateProperty, context) => {
      console.error("Error saving record:", err, newRealEstateProperty);
      if (context?.previousRealEstateProperties) {
        queryClient.setQueryData(
          ["realEstateProperties"],
          context.previousRealEstateProperties
        );
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["realEstateProperties"] });
    },
  });
  // return ...
}
Querying a single item with TanStack Query
To optimistically render updates on a single item, we'll first retrieve the item from the API. We'll use the useQuery hook, passing in the get query as the queryFn parameter. For the query key, we'll use a combination of realEstateProperties and the record's unique identifier.

import { generateClient } from 'aws-amplify/data'
import type { Schema } from '../amplify/data/resource'
import { useQuery } from '@tanstack/react-query'

const client = generateClient<Schema>()

function App() {
  const currentRealEstatePropertyId = "SOME_ID"
  const {
    data: realEstateProperty,
    isLoading,
    isSuccess,
    isError: isErrorQuery,
  } = useQuery({
    queryKey: ["realEstateProperties", currentRealEstatePropertyId],
    queryFn: async () => {
      if (!currentRealEstatePropertyId) { return }

      const { data: property } = await client.models.RealEstateProperty.get({
        id: currentRealEstatePropertyId,
      });
      return property;
    },
  });
}
Optimistically render updates for a record
To optimistically render Amplify Data updates for a single record, use the TanStack useMutation hook, passing in the update mutation as the mutationFn parameter. We'll use the same query key combination used by the single record useQuery hook (realEstateProperties and the record's id) as the query key to optimistically render the updates. We'll use the onMutate function to update the cache directly, as well as the onError function to rollback changes when a request fails.

When directly interacting with the cache via the onMutate function, the newRealEstateProperty parameter will only include fields that are being updated. When calling setQueryData, include the previous values for all fields in addition to the newly updated fields to avoid only rendering optimistic values for updated fields on the UI.

src/App.tsx
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '../amplify/data/resource'
import { useQueryClient, useMutation } from "@tanstack/react-query";

const client = generateClient<Schema>()

function App() {
  const queryClient = useQueryClient();

   const updateMutation = useMutation({
    mutationFn: async (realEstatePropertyDetails: { id: string, name?: string, address?: string }) => {
      const { data: updatedProperty } = await client.models.RealEstateProperty.update(realEstatePropertyDetails);

      return updatedProperty;
    },
    // When mutate is called:
    onMutate: async (newRealEstateProperty: { id: string, name?: string, address?: string }) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ["realEstateProperties", newRealEstateProperty.id],
      });

      await queryClient.cancelQueries({
        queryKey: ["realEstateProperties"],
      });

      // Snapshot the previous value
      const previousRealEstateProperty = queryClient.getQueryData([
        "realEstateProperties",
        newRealEstateProperty.id,
      ]);

      // Optimistically update to the new value
      if (previousRealEstateProperty) {
        queryClient.setQueryData(
          ["realEstateProperties", newRealEstateProperty.id],
          /**
           * `newRealEstateProperty` will at first only include updated values for
           * the record. To avoid only rendering optimistic values for updated
           * fields on the UI, include the previous values for all fields:
           */
          { ...previousRealEstateProperty, ...newRealEstateProperty }
        );
      }

      // Return a context with the previous and new realEstateProperty
      return { previousRealEstateProperty, newRealEstateProperty };
    },
    // If the mutation fails, use the context we returned above
    onError: (err, newRealEstateProperty, context) => {
      console.error("Error updating record:", err, newRealEstateProperty);
      if (context?.previousRealEstateProperty) {
        queryClient.setQueryData(
          ["realEstateProperties", context.newRealEstateProperty.id],
          context.previousRealEstateProperty
        );
      }
    },
    // Always refetch after error or success:
    onSettled: (newRealEstateProperty) => {
      if (newRealEstateProperty) {
        queryClient.invalidateQueries({
          queryKey: ["realEstateProperties", newRealEstateProperty.id],
        });
        queryClient.invalidateQueries({
          queryKey: ["realEstateProperties"],
        });
      }
    },
  });
}
Optimistically render deleting a record
To optimistically render a deletion of a single record, use the TanStack useMutation hook, passing in the delete mutation as the mutationFn parameter. We'll use the same query key combination used by the single record useQuery hook (realEstateProperties and the record's id) as the query key to optimistically render the updates. We'll use the onMutate function to update the cache directly, as well as the onError function to rollback changes when a delete fails.

src/App.tsx
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '../amplify/data/resource'
import { useQueryClient, useMutation } from '@tanstack/react-query'

const client = generateClient<Schema>()

function App() {
  const queryClient = useQueryClient();

    const deleteMutation = useMutation({
    mutationFn: async (realEstatePropertyDetails: { id: string }) => {
      const { data: deletedProperty } = await client.models.RealEstateProperty.delete(realEstatePropertyDetails);
      return deletedProperty;
    },
    // When mutate is called:
    onMutate: async (newRealEstateProperty) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ["realEstateProperties", newRealEstateProperty.id],
      });

      await queryClient.cancelQueries({
        queryKey: ["realEstateProperties"],
      });

      // Snapshot the previous value
      const previousRealEstateProperty = queryClient.getQueryData([
        "realEstateProperties",
        newRealEstateProperty.id,
      ]);

      // Optimistically update to the new value
      if (previousRealEstateProperty) {
        queryClient.setQueryData(
          ["realEstateProperties", newRealEstateProperty.id],
          newRealEstateProperty
        );
      }

      // Return a context with the previous and new realEstateProperty
      return { previousRealEstateProperty, newRealEstateProperty };
    },
    // If the mutation fails, use the context we returned above
    onError: (err, newRealEstateProperty, context) => {
      console.error("Error deleting record:", err, newRealEstateProperty);
      if (context?.previousRealEstateProperty) {
        queryClient.setQueryData(
          ["realEstateProperties", context.newRealEstateProperty.id],
          context.previousRealEstateProperty
        );
      }
    },
    // Always refetch after error or success:
    onSettled: (newRealEstateProperty) => {
      if (newRealEstateProperty) {
        queryClient.invalidateQueries({
          queryKey: ["realEstateProperties", newRealEstateProperty.id],
        });
        queryClient.invalidateQueries({
          queryKey: ["realEstateProperties"],
        });
      }
    },
  });
}
Loading and error states for optimistically rendered data
Both useQuery and useMutation return isLoading and isError states that indicate the current state of the query or mutation. You can use these states to render loading and error indicators.

In addition to operation-specific loading states, TanStack Query provides a useIsFetching hook. For the purposes of this demo, we show a global loading indicator in the Complete Example when any queries are fetching (including in the background) in order to help visualize what TanStack is doing in the background:

function GlobalLoadingIndicator() {
  const isFetching = useIsFetching();
  return isFetching ? <div style={styles.globalLoadingIndicator}></div> : null;
}
For more details on advanced usage of TanStack Query hooks, see the TanStack documentation.

The following example demonstrates how to use the state returned by TanStack to render a loading indicator while a mutation is in progress, and an error message if the mutation fails. For additional examples, see the Complete Example below.

<>
  {updateMutation.isError &&
  updateMutation.error instanceof Error ? (
    <div>An error occurred: {updateMutation.error.message}</div>
  ) : null}

  {updateMutation.isSuccess ? (
    <div>Real Estate Property updated!</div>
  ) : null}

  <button
    onClick={() =>
      updateMutation.mutate({
        id: realEstateProperty.id,
        address: `${Math.floor(
          1000 + Math.random() * 9000
        )} Main St`,
      })
    }
  >
    Update Address
  </button>
</>
Complete example
src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Amplify } from 'aws-amplify'
import outputs from '../amplify_outputs.json'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

Amplify.configure(outputs)

export const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
)
src/App.tsx
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '../amplify/data/resource'
import './App.css'
import { useIsFetching, useMutation, useQuery } from '@tanstack/react-query'
import { queryClient } from './main'
import { useState } from 'react'


const client = generateClient<Schema>({
  authMode: 'iam'
})

function GlobalLoadingIndicator() {
  const isFetching = useIsFetching();

  return isFetching ? <div style={styles.globalLoadingIndicator}></div> : null;
}


function App() {
  const [currentRealEstatePropertyId, setCurrentRealEstatePropertyId] =
  useState<string | null>(null);

  const {
    data: realEstateProperties,
    isLoading,
    isSuccess,
    isError: isErrorQuery,
  } = useQuery({
    queryKey: ["realEstateProperties"],
    queryFn: async () => {
      const response = await client.models.RealEstateProperty.list();

      const allRealEstateProperties = response.data;

      if (!allRealEstateProperties) return null;

      return allRealEstateProperties;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (input: { name: string, address: string }) => {
      const { data: newRealEstateProperty } = await client.models.RealEstateProperty.create(input)
      return newRealEstateProperty;
    },
    // When mutate is called:
    onMutate: async (newRealEstateProperty) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["realEstateProperties"] });

      // Snapshot the previous value
      const previousRealEstateProperties = queryClient.getQueryData([
        "realEstateProperties",
      ]);

      // Optimistically update to the new value
      if (previousRealEstateProperties) {
        queryClient.setQueryData(["realEstateProperties"], (old: Schema["RealEstateProperty"]["type"][]) => [
          ...old,
          newRealEstateProperty,
        ]);
      }

      // Return a context object with the snapshotted value
      return { previousRealEstateProperties };
    },
    // If the mutation fails,
    // use the context returned from onMutate to rollback
    onError: (err, newRealEstateProperty, context) => {
      console.error("Error saving record:", err, newRealEstateProperty);
      if (context?.previousRealEstateProperties) {
        queryClient.setQueryData(
          ["realEstateProperties"],
          context.previousRealEstateProperties
        );
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["realEstateProperties"] });
    },
  });

  function RealEstatePropertyDetailView() {

    const {
      data: realEstateProperty,
      isLoading,
      isSuccess,
      isError: isErrorQuery,
    } = useQuery({
      queryKey: ["realEstateProperties", currentRealEstatePropertyId],
      queryFn: async () => {
        if (!currentRealEstatePropertyId) { return }

        const { data: property } = await client.models.RealEstateProperty.get({ id: currentRealEstatePropertyId });
        return property
      },
    });


    const updateMutation = useMutation({
      mutationFn: async (realEstatePropertyDetails: { id: string, name?: string, address?: string }) => {
        const { data: updatedProperty } = await client.models.RealEstateProperty.update(realEstatePropertyDetails);

        return updatedProperty;
      },
      // When mutate is called:
      onMutate: async (newRealEstateProperty: { id: string, name?: string, address?: string }) => {
        // Cancel any outgoing refetches
        // (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries({
          queryKey: ["realEstateProperties", newRealEstateProperty.id],
        });

        await queryClient.cancelQueries({
          queryKey: ["realEstateProperties"],
        });

        // Snapshot the previous value
        const previousRealEstateProperty = queryClient.getQueryData([
          "realEstateProperties",
          newRealEstateProperty.id,
        ]);

        // Optimistically update to the new value
        if (previousRealEstateProperty) {
          queryClient.setQueryData(
            ["realEstateProperties", newRealEstateProperty.id],
            /**
             * `newRealEstateProperty` will at first only include updated values for
             * the record. To avoid only rendering optimistic values for updated
             * fields on the UI, include the previous values for all fields:
             */
            { ...previousRealEstateProperty, ...newRealEstateProperty }
          );
        }

        // Return a context with the previous and new realEstateProperty
        return { previousRealEstateProperty, newRealEstateProperty };
      },
      // If the mutation fails, use the context we returned above
      onError: (err, newRealEstateProperty, context) => {
        console.error("Error updating record:", err, newRealEstateProperty);
        if (context?.previousRealEstateProperty) {
          queryClient.setQueryData(
            ["realEstateProperties", context.newRealEstateProperty.id],
            context.previousRealEstateProperty
          );
        }
      },
      // Always refetch after error or success:
      onSettled: (newRealEstateProperty) => {
        if (newRealEstateProperty) {
          queryClient.invalidateQueries({
            queryKey: ["realEstateProperties", newRealEstateProperty.id],
          });
          queryClient.invalidateQueries({
            queryKey: ["realEstateProperties"],
          });
        }
      },
    });

    const deleteMutation = useMutation({
      mutationFn: async (realEstatePropertyDetails: { id: string }) => {
        const { data: deletedProperty } = await client.models.RealEstateProperty.delete(realEstatePropertyDetails);
        return deletedProperty;
      },
      // When mutate is called:
      onMutate: async (newRealEstateProperty) => {
        // Cancel any outgoing refetches
        // (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries({
          queryKey: ["realEstateProperties", newRealEstateProperty.id],
        });

        await queryClient.cancelQueries({
          queryKey: ["realEstateProperties"],
        });

        // Snapshot the previous value
        const previousRealEstateProperty = queryClient.getQueryData([
          "realEstateProperties",
          newRealEstateProperty.id,
        ]);

        // Optimistically update to the new value
        if (previousRealEstateProperty) {
          queryClient.setQueryData(
            ["realEstateProperties", newRealEstateProperty.id],
            newRealEstateProperty
          );
        }

        // Return a context with the previous and new realEstateProperty
        return { previousRealEstateProperty, newRealEstateProperty };
      },
      // If the mutation fails, use the context we returned above
      onError: (err, newRealEstateProperty, context) => {
        console.error("Error deleting record:", err, newRealEstateProperty);
        if (context?.previousRealEstateProperty) {
          queryClient.setQueryData(
            ["realEstateProperties", context.newRealEstateProperty.id],
            context.previousRealEstateProperty
          );
        }
      },
      // Always refetch after error or success:
      onSettled: (newRealEstateProperty) => {
        if (newRealEstateProperty) {
          queryClient.invalidateQueries({
            queryKey: ["realEstateProperties", newRealEstateProperty.id],
          });
          queryClient.invalidateQueries({
            queryKey: ["realEstateProperties"],
          });
        }
      },
    });

    return (
      <div style={styles.detailViewContainer}>
        <h2>Real Estate Property Detail View</h2>
        {isErrorQuery && <div>{"Problem loading Real Estate Property"}</div>}
        {isLoading && (
          <div style={styles.loadingIndicator}>
            {"Loading Real Estate Property..."}
          </div>
        )}
        {isSuccess && (
          <div>
            <p>{`Name: ${realEstateProperty?.name}`}</p>
            <p>{`Address: ${realEstateProperty?.address}`}</p>
          </div>
        )}
        {realEstateProperty && (
          <div>
            <div>
              {updateMutation.isPending ? (
                "Updating Real Estate Property..."
              ) : (
                <>
                  {updateMutation.isError &&
                    updateMutation.error instanceof Error ? (
                    <div>An error occurred: {updateMutation.error.message}</div>
                  ) : null}

                  {updateMutation.isSuccess ? (
                    <div>Real Estate Property updated!</div>
                  ) : null}

                  <button
                    onClick={() =>
                      updateMutation.mutate({
                        id: realEstateProperty.id,
                        name: `Updated Home ${Date.now()}`,
                      })
                    }
                  >
                    Update Name
                  </button>
                  <button
                    onClick={() =>
                      updateMutation.mutate({
                        id: realEstateProperty.id,
                        address: `${Math.floor(
                          1000 + Math.random() * 9000
                        )} Main St`,
                      })
                    }
                  >
                    Update Address
                  </button>
                </>
              )}
            </div>

            <div>
              {deleteMutation.isPending ? (
                "Deleting Real Estate Property..."
              ) : (
                <>
                  {deleteMutation.isError &&
                    deleteMutation.error instanceof Error ? (
                    <div>An error occurred: {deleteMutation.error.message}</div>
                  ) : null}

                  {deleteMutation.isSuccess ? (
                    <div>Real Estate Property deleted!</div>
                  ) : null}

                  <button
                    onClick={() =>
                      deleteMutation.mutate({
                        id: realEstateProperty.id,
                      })
                    }
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        )}
        <button onClick={() => setCurrentRealEstatePropertyId(null)}>
          Back
        </button>
      </div>
    );


  }
  return (
    <div>
      {!currentRealEstatePropertyId && (
        <div style={styles.appContainer}>
          <h1>Real Estate Properties:</h1>
          <div>
            {createMutation.isPending ? (
              "Adding Real Estate Property..."
            ) : (
              <>
                {createMutation.isError &&
                createMutation.error instanceof Error ? (
                  <div>An error occurred: {createMutation.error.message}</div>
                ) : null}

                {createMutation.isSuccess ? (
                  <div>Real Estate Property added!</div>
                ) : null}

                <button
                  onClick={() => {
                    createMutation.mutate({
                      name: `New Home ${Date.now()}`,
                      address: `${Math.floor(
                        1000 + Math.random() * 9000
                      )} Main St`,
                    });
                  }}
                >
                  Add RealEstateProperty
                </button>
              </>
            )}
          </div>
          <ul style={styles.propertiesList}>
            {isLoading && (
              <div style={styles.loadingIndicator}>
                {"Loading Real Estate Properties..."}
              </div>
            )}
            {isErrorQuery && (
              <div>{"Problem loading Real Estate Properties"}</div>
            )}
            {isSuccess &&
              realEstateProperties?.map((realEstateProperty, idx) => {
                if (!realEstateProperty) return null;
                return (
                  <li
                    style={styles.listItem}
                    key={`${idx}-${realEstateProperty.id}`}
                  >
                    <p>{realEstateProperty.name}</p>
                    <button
                      style={styles.detailViewButton}
                      onClick={() =>
                        setCurrentRealEstatePropertyId(realEstateProperty.id)
                      }
                    >
                      Detail View
                    </button>
                  </li>
                );
              })}
          </ul>
        </div>
      )}
      {currentRealEstatePropertyId && <RealEstatePropertyDetailView />}
      <GlobalLoadingIndicator />
    </div>
  );

}

export default App

const styles = {
  appContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  detailViewButton: { marginLeft: "1rem" },
  detailViewContainer: { border: "1px solid black", padding: "3rem" },
  globalLoadingIndicator: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    border: "4px solid blue",
    pointerEvents: "none",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    border: "1px dotted grey",
    padding: ".5rem",
    margin: ".1rem",
  },
  loadingIndicator: {
    border: "1px solid black",
    padding: "1rem",
    margin: "1rem",
  },
  propertiesList: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "start",
    width: "50%",
    border: "1px solid black",
    padding: "1rem",
    listStyleType: "none",
  },
} as const;


Vue
/
Build & connect backend
/
Data
/
Modify Amplify-generated AWS resources
Modify Amplify-generated AWS resources
Amplify GraphQL API uses a variety of auto-generated, underlying AWS services and resources. You can customize these underlying resources to optimize the deployed stack for your specific use case.

In your Amplify app, you can access every underlying resource using CDK "L2" or "L1" constructs. Access the generated resources as L2 constructs via the .resources property on the returned stack or access the generated resources as L1 constructs using the .resources.cfnResources property.

amplify/backend.ts
import { defineBackend } from '@aws-amplify/backend';
import { data } from './data/resource';

const backend = defineBackend({
  data
});

const { cfnResources } = backend.data.resources;

for (const table of Object.values(cfnResources.amplifyDynamoDbTables)) {
  table.pointInTimeRecoveryEnabled = true;
}
Customize Amplify-generated AppSync GraphQL API resources
Apply all the customizations on backend.data.resources.graphqlApi or backend.data.resources.cfnResources.cfnGraphqlApi. For example, to enable X-Ray tracing for the AppSync GraphQL API:

amplify/backend.ts
import { defineBackend } from '@aws-amplify/backend';
import { data } from './data/resource';

const backend = defineBackend({
  data
});

const { cfnResources } = backend.data.resources;

cfnResources.cfnGraphqlApi.xrayEnabled = true;
Customize Amplify-generated resources for data models
Pass in the model type name into backend.data.resources.amplifyDynamoDbTables["MODEL_NAME"] to modify the resources generated for that particular model type. For example, to enable time-to-live on the Todo @model type's DynamoDB table:

amplify/backend.ts
import { defineBackend } from '@aws-amplify/backend';
import { data } from './data/resource';

const backend = defineBackend({
  data
});

const { cfnResources } = backend.data.resources;

cfnResources.amplifyDynamoDbTables["Todo"].timeToLiveAttribute = {
  attributeName: "ttl",
  enabled: true,
};
Example - Configure billing mode on a DynamoDB table
Set the DynamoDB billing mode for the DynamoDB table as either "PROVISIONED" or "PAY_PER_REQUEST".

amplify/backend.ts
import { defineBackend } from '@aws-amplify/backend';
import { BillingMode } from "aws-cdk-lib/aws-dynamodb";
import { data } from './data/resource';

const backend = defineBackend({
  data
});

const { cfnResources } = backend.data.resources;

cfnResources.amplifyDynamoDbTables['Todo'].billingMode = BillingMode.PAY_PER_REQUEST;
Example - Configure provisioned throughput for a DynamoDB table
Override the default ProvisionedThroughput provisioned for each model table and its Global Secondary Indexes (GSI). This override is only valid if the "DynamoDBBillingMode" is set to "PROVISIONED".

amplify/backend.ts
import { defineBackend } from '@aws-amplify/backend';
import { data } from './data/resource';

const backend = defineBackend({
  data
});

const { cfnResources } = backend.data.resources;

cfnResources.amplifyDynamoDbTables["Todo"].provisionedThroughput = {
  readCapacityUnits: 5,
  writeCapacityUnits: 5,
};
Example - Enable point-in-time recovery for a DynamoDB table
Enable/disable DynamoDB point-in-time recovery for each model table.

amplify/backend.ts
import { defineBackend } from '@aws-amplify/backend';
import { data } from './data/resource';

const backend = defineBackend({
  data
});

const { cfnResources } = backend.data.resources;

cfnResources.amplifyDynamoDbTables['Todo'].pointInTimeRecoveryEnabled = true;