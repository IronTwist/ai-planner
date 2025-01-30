// eslint-disable-next-line @typescript-eslint/no-require-imports
let http = require('http');

class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  // Add a node to the
  //beginning of the list
  prepend(data) {
    const newNode = new Node(data);
    newNode.next = this.head;
    this.head = newNode;
  }

  // Add a node to the end of the list
  append(data) {
    const newNode = new Node(data);

    if (!this.head) {
      this.head = newNode;
      return;
    }

    let current = this.head;
    while (current.next) {
      current = current.next;
    }
    current.next = newNode;
  }

  // Remove the first node
  deleteHead() {
    if (!this.head) {
      return;
    }
    this.head = this.head.next;
  }

  // Print the list
  printList() {
    let current = this.head;
    while (current) {
      console.log(current.data);
      current = current.next;
    }
  }
}

const list = new LinkedList();
list.append('A');
list.append('B');
list.prepend('C');
list.printList(); // Output: C A B
list.deleteHead();
list.printList();

const server = http.createServer((req, res) => {
  console.log('Request: ', req.url, req.method);
  if (req.url === '/test') {
    res.writeHead(200);

    const data = {
      id: 1,
      name: 'test',
    };
    res.end(JSON.stringify(data));
  }

  if (req.url === '/api') {
    if (req.method === 'GET') {
      res.writeHead(200);
      const data = {
        id: 1,
        name: 'test',
      };

      res.end(`You accessed get ${JSON.stringify(data)}`);
    }

    if (req.method === 'POST') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      let body = null;

      req.on('data', chunk => {
        body = JSON.parse(chunk.toString());
      });

      req.on('end', () => {
        try {
          console.log('body', body);
          const datFromBody = body;

          const response = {
            id: datFromBody.id,
            name: datFromBody.input + ' manipulated 2005',
          };

          res.end(`You accessed post ${JSON.stringify(response)}`);
        } catch (e) {
          console.log(e);
        }
      });

      // res.end(`You accessed post ${JSON.stringify(body)}`);
    }

    if (req.method === 'PUT') {
      res.writeHead(200);
      res.end('You accessed put');
    }

    if (req.method === 'DELETE') {
      res.writeHead(200);
      res.end('You accessed delete');
    }

    if (req.method === 'PATCH') {
      res.writeHead(200);
      res.end('You accessed patch');
    }
  }
});

server.listen(3005, () => {
  console.log('Server running on port 3005');
});

server.on('get', (req, res) => {
  if (req.url === '/test') {
    res.writeHead(200);
    res.end('You accessed get');
  }
});
server.on('post', (req, res) => {
  if (req.url === '/test') {
    res.writeHead(200);
    res.end('You accessed post');
  }
});
