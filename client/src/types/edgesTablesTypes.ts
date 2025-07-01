export interface Vertex {
id: number;
name: string;
}
export interface ControlGroup {
id: string;
name: string;
}

export interface Edge {
source: number;
target: number;
defaultFlow: number;
vulnerability: {
    name: string;
    controls: string[];      
    adjustment?: any;
};
url?: string;
}

export interface Props {
vertices: Vertex[];
controlGroups: ControlGroup[];
edges: Edge[];
setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}
