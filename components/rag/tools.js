export default tools = [
    {
        "type": "function",
        "function": {
            "name": "add_edge",
            "description": "Add an edge to the objective graph.",
            "parameters": {
                "type": "object",
                "properties": {
                    "from": {
                        "type": "string",
                        "description": "The starting node of the edge."
                    },
                    "to": {
                        "type": "string",
                        "description": "The ending node of the edge."
                    }
                },
                "required": ["from", "to"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "remove_node",
            "description": "Remove a node from the objective graph.",
            "parameters": {
                "type": "object",
                "properties": {
                    "node": {
                        "type": "string",
                        "description": "The node to remove."
                    }
                },
                "required": ["node"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "remove_edge",
            "description": "Remove an edge from the objective graph.",
            "parameters": {
                "type": "object",
                "properties": {
                    "from": {
                        "type": "string",
                        "description": "The starting node of the edge."
                    },
                    "to": {
                        "type": "string",
                        "description": "The ending node of the edge."
                    }
                },
                "required": ["from", "to"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "add_todo",
            "description": "Add a todo item to the objective graph.",
            "parameters": {
                "type": "object",
                "properties": {
                    "todo": {
                        "type": "string",
                        "description": "The todo item to add."
                    }
                },
                "required": ["todo"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "complete_todo",
            "description": "Complete a todo item.",
            "parameters": {
                "type": "object",
                "properties": {
                    "index": {
                        "type": "number",
                        "description": "The index of the todo item to complete."
                    }
                },
                "required": ["index"]
            }
        }
    }
];