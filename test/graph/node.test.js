const Node = require('../../src/graph/node');
const Graph = require('../../src/graph/graph');
const Edge = require('../../src/graph/edge');

describe('Node tests', () => {
  test('when created graph instance initialized correctly', () => {
    // when
    const graph = new Graph();
    const node = new Node('name', 1, 2, graph);

    // then
    expect(node.id).toBeDefined();
    expect(node.graph).toBe(graph);
    expect(node.name).toBe('name');
    expect(node.x).toBe(1);
    expect(node.y).toBe(2);
    expect(node.edges).toEqual([]);
  });

  test('given node when addEdge then edge added to edges', () => {
    // given
    const graph = new Graph();
    const node = new Node('name', 1, 2, graph);

    // when
    const edge = new Edge();
    node.addEdge(edge);

    // then
    expect(node.edges.includes(edge)).toBe(true);
  });

  test('given node with edge to other node when getPathsFrom then returns edge to other node', () => {
    // given
    const graph = new Graph();
    const node = new Node('name', 1, 2, graph);
    const edge = new Edge(node);
    const otherEdge = new Edge(new Node());
    node.addEdge(edge);
    node.addEdge(otherEdge);

    // when
    const paths = node.getPathsFrom();

    // then
    expect(paths.length).toBe(1);
    expect(paths.includes(edge)).toBe(true);
  });

  test('given node with edge to other node when getPathsFrom then returns edge to other node', () => {
    // given
    const graph = new Graph();
    const node = new Node('name', 1, 2, graph);
    const edge = new Edge(new Node(), node);
    const otherEdge = new Edge(node, new Node());
    node.addEdge(edge);
    node.addEdge(otherEdge);

    // when
    const paths = node.getPathsTo();

    // then
    expect(paths.length).toBe(1);
    expect(paths.includes(edge)).toBe(true);
  });
});