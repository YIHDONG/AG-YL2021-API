const Edge = require('../../src/graph/edge');
const Graph = require('../../src/graph/graph');
const { TraverseEdgeEvent } = require('../../src/graph/traverseEdgeEvent');

describe('TraverseEdgeEvent tests', () => {
  test('given traverse edge event when apply then applies unit of work', () => {
    // given
    const graph = new Graph();
    const edge = new Edge();
    edge.graph = graph;
    graph.edges.push(edge);

    const traverseEdgeEvent = new TraverseEdgeEvent({
      edgeId: edge.id,
    });

    // when
    traverseEdgeEvent.apply(graph);

    // then
    expect(graph.edges).toBeDefined();
    expect(graph.edges.length).toBe(1);
    const traverseEdge = graph.edges[0];
    expect(traverseEdge).toBe(edge);
    expect(traverseEdge.traversed).toBe(true);
    expect(traverseEdge.focused).toBe(true);
  });

  test('given traverse edge event and graph does not have edge when apply then throws', () => {
    // given
    const graph = new Graph();
    const edge = new Edge();
    edge.graph = graph;
    graph.edges.push(edge);

    const traverseEdgeEvent = new TraverseEdgeEvent({
      edgeId: 'someOtherId',
    });

    // when + then
    expect(() => traverseEdgeEvent.apply(graph)).toThrow();
  });
});
