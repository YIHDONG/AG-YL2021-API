const Graph = require('../../src/graph/graph');
const Event = require('../../src/graph/event');
const eventFactory = require('../../src/graph/eventFactory');
const Node = require('../../src/graph/node');
const Edge = require('../../src/graph/edge');

describe('Graph tests', () => {
  test('when graph created then initialized correctly', () => {
    // when
    const graph = new Graph();

    // then
    expect(graph.edges).toEqual([]);
    expect(graph.nodes).toEqual([]);
    expect(graph.currentNode).toBeUndefined();
    expect(graph.events).toEqual([]);
    expect(graph.subscriptions).toEqual({});
  });

  test('given graph when on called then subscriber added', () => {
    // given
    const graph = new Graph();
    const eventType = 'event';
    const handler = () => {};

    // when
    const subscription = graph.on(eventType, handler);

    // then
    expect(subscription.graph).toBe(graph);
    expect(graph.subscriptions[eventType][subscription.id]).toBe(handler);
  });

  test('given graph when apply event then event applied and added to events', () => {
    // given
    const graph = new Graph();
    const event = new Event('type', {}, new Date());
    const eventData = {
      type: event.type,
      data: event.data,
    };
    const applySpy = jest.spyOn(event, 'apply').mockImplementation(() => {});
    const makeSpy = jest.spyOn(eventFactory, 'make').mockReturnValue(event);

    // when
    graph.apply(eventData);

    expect(graph.events).toEqual([{
      type: event.type,
      data: event.data,
      time: event.time,
    }]);
    expect(makeSpy).toHaveBeenCalledWith(eventData);
    expect(applySpy).toHaveBeenCalledWith(graph);
  });

  test('given graph with subscriptions when apply event then subscribers notified', () => {
    // given
    const graph = new Graph();
    const handler = jest.fn(() => {});
    const otherHandler = jest.fn(() => {});
    const eventType = 'type';
    const eventData = {
      type: eventType,
      data: {},
    };
    const event = new Event(eventData.type, eventData.data, new Date());
    jest.spyOn(event, 'apply').mockImplementation(() => {});
    jest.spyOn(eventFactory, 'make').mockReturnValue(event);
    graph.on(eventType, handler);
    graph.on('bogus', otherHandler);

    // when
    graph.apply(eventData);

    // then
    expect(handler).toHaveBeenCalledWith(eventData.data);
    expect(otherHandler).not.toHaveBeenCalled();
  });

  test('given graph when addNode event created and applied', () => {
    // given
    const graph = new Graph();
    const event = new Event('addNode', {
      name: 'someName',
      x: 1,
      y: 2,
    }, new Date());
    const applySpy = jest.spyOn(event, 'apply').mockImplementation(() => {});
    const makeSpy = jest.spyOn(eventFactory, 'make').mockReturnValue(event);

    // when
    graph.addNode('someName', 1, 2);

    expect(graph.events.length).toEqual(1);
    expect(graph.events[0].type).toBe('addNode');
    expect(graph.events[0].data).toEqual({
      name: 'someName',
      x: 1,
      y: 2,
    });
    expect(makeSpy).toHaveBeenCalledWith({
      type: 'addNode',
      data: {
        name: 'someName',
        x: 1,
        y: 2,
      },
    });
    expect(applySpy).toHaveBeenCalledWith(graph);
  });

  test('given graph when addEdge event created and applied', () => {
    // given
    const graph = new Graph();
    const event = new Event('addEdge', {
      name: 'someName',
      fromNodeId: 'fromNodeId',
      toNodeId: 'toNodeId',
      weight: 1,
    }, new Date());
    const applySpy = jest.spyOn(event, 'apply').mockImplementation(() => {});
    const makeSpy = jest.spyOn(eventFactory, 'make').mockReturnValue(event);

    // when
    graph.addEdge('fromNodeId', 'toNodeId', 'someName', 1);

    expect(graph.events.length).toEqual(1);
    expect(graph.events[0].type).toBe('addEdge');
    expect(graph.events[0].data).toEqual({
      name: 'someName',
      fromNodeId: 'fromNodeId',
      toNodeId: 'toNodeId',
      weight: 1,
    });
    expect(makeSpy).toHaveBeenCalledWith({
      type: 'addEdge',
      data: {
        name: 'someName',
        fromNodeId: 'fromNodeId',
        toNodeId: 'toNodeId',
        weight: 1,
      },
    });
    expect(applySpy).toHaveBeenCalledWith(graph);
  });

  test('given graph with edge when traverse then event created and applied to graph', () => {
    // given
    const event = new Event();
    const eventSpy = jest.spyOn(event, 'apply').mockImplementation(() => {}); // do nothing
    const eventFactorySpy = jest.spyOn(eventFactory, 'make').mockReturnValue(event);

    const graph = new Graph();

    const someEdgeId = 'someId';

    // when
    graph.traverseEdge(someEdgeId);

    // then
    expect(eventFactorySpy).toHaveBeenCalledWith({ type: 'traverseEdge', data: { edgeId: someEdgeId } });
    expect(eventSpy).toHaveBeenCalledWith(graph);
  });

  test('given graph with node when visited then event created and applied to graph', () => {
    // given
    const event = new Event();
    const eventSpy = jest.spyOn(event, 'apply').mockImplementation(() => {}); // do nothing
    const eventFactorySpy = jest.spyOn(eventFactory, 'make').mockReturnValue(event);
    const graph = new Graph();
    const nodeId = 'someNodeId';

    // when
    graph.visitNode(nodeId);

    // then
    expect(eventSpy).toHaveBeenCalledWith(graph);
    expect(eventFactorySpy).toHaveBeenCalledWith({
      type: 'visitNode',
      data: {
        nodeId,
      },
    });
  });

  test('given graph with edge when removed then event created and applied to graph', () => {
    // given
    const event = new Event();
    const eventSpy = jest.spyOn(event, 'apply').mockImplementation(() => {}); // do nothing
    const eventFactorySpy = jest.spyOn(eventFactory, 'make').mockReturnValue(event);
    const graph = new Graph();
    const edgeId = 'someEdgeId';

    // when
    graph.removeEdge(edgeId);

    // then
    expect(eventSpy).toHaveBeenCalledWith(graph);
    expect(eventFactorySpy).toHaveBeenCalledWith({
      type: 'removeEdge',
      data: {
        edgeId,
      },
    });
  });

  test('given graph with node when removed then event created and applied to graph', () => {
    // given
    const event = new Event();
    const eventSpy = jest.spyOn(event, 'apply').mockImplementation(() => {}); // do nothing
    const eventFactorySpy = jest.spyOn(eventFactory, 'make').mockReturnValue(event);
    const graph = new Graph();
    const nodeId = 'someNodeId';

    // when
    graph.removeNode(nodeId);

    // then
    expect(eventSpy).toHaveBeenCalledWith(graph);
    expect(eventFactorySpy).toHaveBeenCalledWith({
      type: 'removeNode',
      data: {
        nodeId,
      },
    });
  });

  test('given graph with node when visited then event created and applied to graph', () => {
    // given
    const event = new Event();
    const eventSpy = jest.spyOn(event, 'apply').mockImplementation(() => {}); // do nothing
    const eventFactorySpy = jest.spyOn(eventFactory, 'make').mockReturnValue(event);
    const graph = new Graph();
    const nodeId = 'someNodeId';

    // when
    graph.visitNode(nodeId);

    // then
    expect(eventSpy).toHaveBeenCalledWith(graph);
    expect(eventFactorySpy).toHaveBeenCalledWith({
      type: 'visitNode',
      data: {
        nodeId,
      },
    });
  });

  test('given graph has node when getNodeById then node returned', () => {
    // given
    const graph = new Graph();
    const node = new Node();
    graph.nodes.push(node);

    // when
    const retrieved = graph.getNodeById(node.id);

    // then
    expect(retrieved).toBe(node);
  });

  test('given graph has no node with id when getNodeById then node returned', () => {
    // given
    const graph = new Graph();
    const node = new Node();
    graph.nodes.push(node);

    // when then
    expect(() => graph.getNodeById('someOtherNode')).toThrow();
  });

  test('given graph has edge when getNodeById then edge returned', () => {
    // given
    const graph = new Graph();
    const edge = new Edge();
    graph.edges.push(edge);

    // when
    const retrieved = graph.getEdgeById(edge.id);

    // then
    expect(retrieved).toBe(edge);
  });

  test('given graph has no node with id when getNodeById then node returned', () => {
    // given
    const graph = new Graph();
    const edge = new Edge();
    graph.edges.push(edge);

    // when then
    expect(() => graph.getEdgeById('someOtheredge')).toThrow();
  });

  test('given graph has nodes that share edge then hasEdge returns true', () => {
    const graph = new Graph();
    const fromNode = new Node();
    const toNode = new Node();
    const edge = new Edge(fromNode, toNode);
    graph.edges.push(edge);

    // when
    const hasNode = graph.hasEdge(fromNode.id, toNode.id);

    // then
    expect(hasNode).toBe(true);
  });

  test('given graph has no nodes that share edge then hasEdge returns true', () => {
    const graph = new Graph();
    const fromNode = new Node();
    const toNode = new Node();
    const edge = new Edge(fromNode, toNode);
    graph.edges.push(edge);

    // when
    const hasNode = graph.hasEdge(toNode.id, fromNode.id);

    // then
    expect(hasNode).toBe(false);
  });

  test('given graph has nodes and edges when clearFocus then clearFocus called on each node and edge', () => {
    // given
    const graph = new Graph();
    const edge = new Edge();
    const node = new Node();

    graph.edges = [edge];
    graph.nodes = [node];

    const edgeSpy = jest.spyOn(edge, 'clearFocus').mockImplementation(() => {});
    const nodeSpy = jest.spyOn(node, 'clearFocus').mockImplementation(() => {});

    // when
    graph.clearFocus();

    // then
    expect(edgeSpy).toHaveBeenCalled();
    expect(nodeSpy).toHaveBeenCalled();
  });

  test('given nodes and edges are valid when init then graph initialized', () => {
    // given
    const nodes = [
      {
        id: 'someId',
        x: 1,
        y: 2,
        name: 'someName',
      },
      {
        id: 'someOtherId',
        x: 3,
        y: 4,
        name: 'someOtherName',
      },
    ];

    const edges = [
      {
        id: 'someEdgeId',
        fromNodeId: 'someId',
        toNodeId: 'someOtherId',
        name: 'someEdgeName',
        weight: 1,
      },
      {
        id: 'someOtherEdgeId',
        fromNodeId: 'someOtherId',
        toNodeId: 'someId',
        name: 'someOtherEdgeName',
        weight: 2,
      },
    ];
    const graph = new Graph();

    // when
    graph.init(nodes, edges);

    // then
    expect(graph.nodes.length).toBe(2);
    const nodeFirst = graph.getNodeById('someId');
    expect(nodeFirst.id).toBe('someId');
    expect(nodeFirst.x).toBe(1);
    expect(nodeFirst.y).toBe(2);
    expect(nodeFirst.name).toBe('someName');
    expect(nodeFirst.edges.length).toBe(2);
    const nodeSecond = graph.getNodeById('someOtherId');
    expect(nodeSecond.id).toBe('someOtherId');
    expect(nodeSecond.x).toBe(3);
    expect(nodeSecond.y).toBe(4);
    expect(nodeSecond.name).toBe('someOtherName');
    expect(nodeSecond.edges.length).toBe(2);
    expect(graph.edges.length).toBe(2);
    const edgeFirst = graph.getEdgeById('someEdgeId');
    expect(edgeFirst.id).toBe('someEdgeId');
    expect(edgeFirst.name).toBe('someEdgeName');
    expect(edgeFirst.weight).toBe(1);
    expect(edgeFirst.fromNode).toBe(nodeFirst);
    expect(edgeFirst.toNode).toBe(nodeSecond);
    const edgeSecond = graph.getEdgeById('someOtherEdgeId');
    expect(edgeSecond.id).toBe('someOtherEdgeId');
    expect(edgeSecond.name).toBe('someOtherEdgeName');
    expect(edgeSecond.weight).toBe(2);
    expect(edgeSecond.fromNode).toBe(nodeSecond);
    expect(edgeSecond.toNode).toBe(nodeFirst);
  });

  test('given node with no id when init then throws', () => {
    // given
    const nodes = [
      {
        x: 1,
        y: 2,
        name: 'someName',
      },
      {
        id: 'someOtherId',
        x: 3,
        y: 4,
        name: 'someOtherName',
      },
    ];

    const edges = [
      {
        id: 'someEdgeId',
        fromNodeId: 'someId',
        toNodeId: 'someOtherId',
        name: 'someEdgeName',
        weight: 1,
      },
      {
        id: 'someOtherEdgeId',
        fromNodeId: 'someOtherId',
        toNodeId: 'someId',
        name: 'someOtherEdgeName',
        weight: 2,
      },
    ];
    const graph = new Graph();

    // when + then
    expect(() => graph.init(nodes, edges)).toThrow();
  });

  test('given edge with no id when init then throws', () => {
    // given
    const nodes = [
      {
        id: 'someId',
        x: 1,
        y: 2,
        name: 'someName',
      },
      {
        id: 'someOtherId',
        x: 3,
        y: 4,
        name: 'someOtherName',
      },
    ];

    const edges = [
      {
        fromNodeId: 'someId',
        toNodeId: 'someOtherId',
        name: 'someEdgeName',
        weight: 1,
      },
      {
        id: 'someOtherEdgeId',
        fromNodeId: 'someOtherId',
        toNodeId: 'someId',
        name: 'someOtherEdgeName',
        weight: 2,
      },
    ];
    const graph = new Graph();

    // when + then
    expect(() => graph.init(nodes, edges)).toThrow();
  });

  test('given edge with bad fromNodId when init then throws', () => {
    // given
    const nodes = [
      {
        id: 'someId',
        x: 1,
        y: 2,
        name: 'someName',
      },
      {
        id: 'someOtherId',
        x: 3,
        y: 4,
        name: 'someOtherName',
      },
    ];

    const edges = [
      {
        id: 'someEdgeId',
        fromNodeId: 'someBadId',
        toNodeId: 'someOtherId',
        name: 'someEdgeName',
        weight: 1,
      },
      {
        id: 'someOtherEdgeId',
        fromNodeId: 'someOtherId',
        toNodeId: 'someId',
        name: 'someOtherEdgeName',
        weight: 2,
      },
    ];
    const graph = new Graph();

    // when + then
    expect(() => graph.init(nodes, edges)).toThrow();
  });

  test('given edge with bad toNodId when init then throws', () => {
    // given
    const nodes = [
      {
        id: 'someId',
        x: 1,
        y: 2,
        name: 'someName',
      },
      {
        id: 'someOtherId',
        x: 3,
        y: 4,
        name: 'someOtherName',
      },
    ];

    const edges = [
      {
        id: 'someEdgeId',
        fromNodeId: 'someId',
        toNodeId: 'someBadOtherId',
        name: 'someEdgeName',
        weight: 1,
      },
      {
        id: 'someOtherEdgeId',
        fromNodeId: 'someOtherId',
        toNodeId: 'someId',
        name: 'someOtherEdgeName',
        weight: 2,
      },
    ];
    const graph = new Graph();

    // when + then
    expect(() => graph.init(nodes, edges)).toThrow();
  });

  test('given graph when copy then result equals to original graph', () => {
    // given
    const graph = new Graph();
    const eventType = 'event';
    const handler = () => {};

    graph.on(eventType, handler);
    graph.addNode('x', 1, 2);
    graph.addNode('y', 3, 4);

    graph.addEdge(0, 1, 'edge', 1);

    // when
    const newGraph = graph.copy();

    // then
    expect(graph.subscriptions).toEqual(newGraph.subscriptions);
    expect(graph.edges).toEqual(newGraph.edges);
    expect(graph.nodes).toEqual(newGraph.nodes);
    expect(graph.events).toEqual(newGraph.events);
  });
});
