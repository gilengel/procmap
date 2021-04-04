import { PostMultiple, PostOne } from '../models/Backend'
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { Node as ReteNode } from "rete";

import { CreateNowTimestamp } from '../models/Date'

import { Page, NewPage } from '../models/Page'

import { NodeData } from "rete/types/core/data"

export function convertReteNode2NewPage(reteNode: NodeData) : NewPage {
  return {
    page_id: reteNode.data.uuid ? reteNode.data.uuid as string : 'INVALID_UUID',
    name: reteNode.data.name ? reteNode.data.name as string : "UntitledNewPage",
    created_at: reteNode.data.createdAt ? reteNode.data.createdAt as number : CreateNowTimestamp()
  }
}

const CharacterNames = [
  "Homer Simpson",
  "Marge Simpson",
  "Bart Simpson",
  "Lisa Simpson",
  "Maggie Simpson",
  "Abraham Simpson",
  "Santa's Little Helper",
  "Snowball II/V",
  "Apu Nahasapeemapetilon",
  "Barney Gumble",
  "Bleeding Gums Murphy[B]",
  "Chief Clancy Wiggum",
  "Dewey Largo",
  "Eddie",
  "Edna Krabappel",
  "Itchy & Scratchy",
  "Janey Powell",
  "Jasper Beardly",
  "Kent Brockman",
  "Krusty The Clown",
  "Lenny Leonard",
  "Lou",
  "Martin Prince",
  "Marvin Monroe[C]",
  "Milhouse Van Houten",
  "Moe Szyslak",
  "Mr. Burns",
  "Ned Flanders",
  "Otto Mann",
  "Patty Bouvier",
  "Ralph Wiggum",
  "Reverend Timothy Lovejoy",
  "Selma Bouvier",
  "Seymour Skinner",
  "Sherri & Terri",
];

function convertNodeFromReteToDB(node: ReteNode): NewPage {
  return {
    page_id: node.uuid,
    name: CharacterNames[Math.floor(Math.random() * CharacterNames.length)],
    created_at: CreateNowTimestamp(),
  };
}

function convertConnectionFromReteToDB(incoming: ReteNode, outgoing: ReteNode) {
  const incomingPage = incoming.data.db_id;
  const outgoingPage = outgoing.data.db_id;

  return {
    connection_id: uuidv4(),
    created_at: CreateNowTimestamp(),
    incoming_page: incomingPage,
    outgoing_page: outgoingPage,
  };
}

function persistNodeConnection(incoming: ReteNode, outgoing: ReteNode) {
  const dbConnection = convertConnectionFromReteToDB(incoming, outgoing);

  PostOne<any>(`page_connection`, dbConnection)
    .then((result: any) => {
      console.log("yiha")
    })
    .catch((err) => {
      console.log(err)
    })
}

function walkNode(node: ReteNode) {
  if (node.data.walked) {
    return;
  }

  node.data.walked = true;

  const output = node.outputs.get("page");

  if (output) {
    const incoming = node;

    for (const connection of output.connections) {
      const outgoing = connection.input.node as ReteNode;

      persistNodeConnection(incoming, outgoing);
      walkNode(connection.input.node as ReteNode);
    }
  }
}

function walkGraph(graph: Array<ReteNode>) {
  const startNode = graph.find((node) => node.name === FLOW_ROUTER_START);
  if (!startNode) {
    throw "Persisting aborted: Flow graph has no start point";
  }

  const endNode = graph.find((node) => node.name === FLOW_ROUTER_END);
  if (!endNode) {
    //throw "Persisting aborted: Flow graph has no end point";
  }

  const nodes = new Array();
  for (const node of graph) {
    node.data.walked = undefined;
    nodes.push(convertNodeFromReteToDB(node));
  }

  PostMultiple<any>(`pages`, nodes)
    .then((result: any[]) => {

      for (const node of graph) {
        const dbResult = result.find(
          (element) => element.page_id === node.uuid
        );
        node.data.db_id = dbResult.page_pk;
      }

      walkNode(startNode);
    })
    .catch(() => {

    })

}

function persistNode(node: ReteNode) {
  axios
    .post("http://localhost:8000/pages", pageData)
    .then(function (response) {
      const result = JSON.parse(response.request.response);
      console.log(result);
    })
    .catch(function (error) {
      // console.log(error)
    });
}
