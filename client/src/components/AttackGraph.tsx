// src/components/AttackGraph.tsx
import { useMemo, useState, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  MarkerType,
  EdgeLabelRenderer,
  Position,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  type Node,
  type Edge,
  type EdgeProps,
} from "reactflow";
import * as dagre from "@dagrejs/dagre";         

import "reactflow/dist/style.css";
import "./AttackGraph.css";

import type { Vertex } from "./VerticesTable";
import type { Edge as Ejs } from "../types/edgesTablesTypes";

/* ─────────────────────────  palette  ───────────────────────── */
const COL_NODE = "#d1fae5";
const COL_TARGET = "#fef3c7";
const COL_LOW = "#16a34a";
const COL_WARN = "#f59e0b";
const COL_HIGH = "#dc2626";

const NODE_W = 120,
  NODE_H = 40;
const flowColour = (f = 1) => (f <= 0.05 ? COL_LOW : f <= 0.2 ? COL_WARN : COL_HIGH);

/* ──────────────  dagre layout helper  ────────────── */
const runLayout = (nodes: Node[], edges: Edge[]) => {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "TB", ranksep: 80, nodesep: 40 });
  g.setDefaultEdgeLabel(() => ({}));
  nodes.forEach((n) => g.setNode(n.id, { width: NODE_W, height: NODE_H }));
  edges.forEach((e) => g.setEdge(e.source, e.target));
  dagre.layout(g);
  return nodes.map((n) => {
    const { x, y } = g.node(n.id);
    n.position = { x: x - NODE_W / 2, y: y - NODE_H / 2 };
    return n;
  });
};

/* ──────────────  custom edge with tooltip  ────────────── */
const FlowEdge: React.FC<EdgeProps> = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  markerEnd,
  data,
}) => {
  const [hover, setHover] = useState(false);

  const path = `M${sourceX},${sourceY}L${targetX},${targetY}`;
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;

  /* offset tooltip 20 px away perpendicular to the edge */
  const dx = targetX - sourceX,
    dy = targetY - sourceY,
    len = Math.hypot(dx, dy) || 1,
    off = 20;

  const labelX = midX - (dy / len) * off;
  const labelY = midY + (dx / len) * off;

  return (
    <>
      {/* visible dashed arrow */}
      <path
        d={path}
        stroke={data.colour}
        strokeWidth={2}
        fill="none"
        className="edge-dash"
        markerEnd={markerEnd}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      />
      {/* fat invisible hit-area */}
      <path
        d={path}
        stroke="transparent"
        strokeWidth={16}
        fill="none"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      />

      {hover && (
        <EdgeLabelRenderer>
          <div
            className="edge-tooltip"
            style={{
              position: "absolute",
              pointerEvents: "none",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
          >
            <b>flow</b>: {data.flow}
            <br />
            <b>edge&nbsp;flow</b>: {data.edgeFlow}
            <br />
            <b>vulnerability</b>: {data.vuln || "—"}
            <br />
            <b>controls</b>: {data.controls || "—"}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};
const edgeTypes = { flow: FlowEdge };

/* ──────────────  component  ────────────── */
interface Props {
  vertices: Vertex[];
  edges: Ejs[];
}

export default function AttackGraph({ vertices, edges }: Props) {
  /* nodes */
  const rfNodes: Node[] = useMemo(
    () =>
      vertices.map((v) => ({
        id: v.id.toString(),
        data: { label: v.name || v.id },
        position: { x: 0, y: 0 },
        style: {
          width: NODE_W,
          height: NODE_H,
          borderRadius: 6,
          border: "1px solid #000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          background: v.defaultTarget ? COL_TARGET : COL_NODE,
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      })),
    [vertices]
  );

  /* edges */
  const rfEdges: Edge[] = useMemo(
    () =>
      edges.map((e, i) => {
        const col = flowColour(e.defaultFlow);
        return {
          id: `e${i}`,
          type: "flow",
          source: e.source.toString(),
          target: e.target.toString(),
          markerEnd: { type: MarkerType.ArrowClosed, color: col },
          data: {
            colour: col,
            flow: e.defaultFlow ?? "",
            edgeFlow: e.defaultFlow ?? "",
            vuln: e.vulnerability?.name ?? "",
            controls: (e.vulnerability?.controls || []).join(","),
          },
        };
      }),
    [edges]
  );

  const initialNodes = useMemo(() => runLayout([...rfNodes], rfEdges), [rfNodes, rfEdges]);

  // 1. Grab the setter functions (setNodes, setEdges)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [links, setEdges, onEdgesChange] = useEdgesState(rfEdges);

  // 2. Add the Magic Watcher!
  useEffect(() => {
    // Whenever the data from the API calculation changes, force ReactFlow to update!
    setNodes(initialNodes);
    setEdges(rfEdges);
  }, [initialNodes, rfEdges, setNodes, setEdges]);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={links}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        edgeTypes={edgeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <MiniMap nodeColor={() => COL_NODE} pannable />
        <Controls position="bottom-left" />
        <Background variant={BackgroundVariant.Lines} gap={24} color="#e5e7eb" />
      </ReactFlow>
    </div>
  );
}
