/**
 * Represents an editable table component.
 * 
 * @remarks
 * This component provides a table with editable cells.
 * 
 * @returns {JSX.Element} The rendered editable table component.
 */
import { CSSProperties, useState } from "react";

// Base types and interfaces
export interface BaseItem {
  id: number;
  [key: string]: any;
}

export interface Column {
  key: string;
  header: string;
  editable?: boolean;
  type?: "text" | "select" | "number";
  options?: string[];
  formatValue?: (value: any) => string;
}

export interface EditableTableProps<T extends BaseItem> {
  items: T[];
  columns: Column[];
  idField: keyof T;
  onUpdate: (id: number, field: string, value: any) => void;
  onAdd: (item: Omit<T, "id">) => void; // Omit the 'id' field from the item
}

/**
 * EditableTable component.
 * 
 * @remarks
 * This component provides a table with editable cells.
 * 
 * @returns {JSX.Element} The rendered editable table component.
 */
export const EditableTable = <T extends BaseItem>({
  items,
  columns,
  idField,
  onUpdate,
  onAdd,
}: EditableTableProps<T>): JSX.Element => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<any>(null);

  const [newItem, setNewItem] = useState<Partial<T> | null>(null);

  const handleEditClick = (item: T, field: string) => {
    setEditingId(item[idField] as number);
    setEditingField(field);
    setEditValue(item[field]);
  };

  const handleSaveClick = (id: number) => {
    if (editValue !== null && editingField) {
      onUpdate(id, editingField, editValue);
      setEditingId(null);
      setEditingField(null);
      setEditValue(null);
    }
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setEditingField(null);
    setEditValue(null);
  };

  const handleNewItemChange = (field: string, value: any) => {
    setNewItem((prev) => ({ ...prev, [field]: value } as Partial<T>));
  };

  const handleSaveNewItem = () => {
    if (newItem) {
      onAdd(newItem as Omit<T, "id">);
      setNewItem(null);
    }
  };

  const renderCell = (item: T, column: Column) => {
    const isEditing =
      editingId === item[idField] && editingField === column.key;
    const value = item[column.key];

    if (isEditing && column.editable) {
      if (column.type === "select" && column.options) {
        return (
          <select
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            style={inputStyle}
          >
            <option value="">Select {column.header}</option>
            {column.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      } else if (column.type === "number") {
        return (
          <input
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(Number(e.target.value))}
            style={inputStyle}
            step="0.01"
          />
        );
      }
      return (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          style={inputStyle}
        />
      );
    }

    return column.formatValue ? column.formatValue(value) : value;
  };

  return (
    <div style={wrapperStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} style={tableHeaderStyle}>
                {column.header}
              </th>
            ))}
            <th style={tableHeaderStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item[idField] as number}>
              {columns.map((column) => (
                <td key={column.key} style={tableCellStyle}>
                  {renderCell(item, column)}
                </td>
              ))}
              <td style={tableCellStyle}>
                <div style={buttonContainerStyle}>
                  {editingId === item[idField] ? (
                    <>
                      <button
                        onClick={() => handleSaveClick(item[idField] as number)}
                        style={buttonStyle}
                      >
                        Save
                      </button>
                      <button onClick={handleCancelClick} style={buttonStyle}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    columns
                      .filter((column) => column.editable)
                      .map((column) => (
                        <button
                          key={column.key}
                          onClick={() => handleEditClick(item, column.key)}
                          style={buttonStyle}
                        >
                          Edit {column.header}
                        </button>
                      ))
                  )}
                </div>
              </td>
            </tr>
          ))}

          {/* Row for Adding New Item */}
          {newItem && (
            <tr>
              {columns.map((column) => (
                <td key={column.key} style={tableCellStyle}>
                  {column.editable ? (
                    column.type === "select" && column.options ? (
                      <select
                        value={newItem[column.key]}
                        onChange={(e) =>
                          handleNewItemChange(column.key, e.target.value)
                        }
                        style={inputStyle}
                      >
                        <option value="">Select {column.header}</option>
                        {column.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : column.type === "number" ? (
                      <input
                        type="number"
                        value={newItem[column.key]}
                        onChange={(e) =>
                          handleNewItemChange(
                            column.key,
                            Number(e.target.value)
                          )
                        }
                        style={inputStyle}
                        step="0.01"
                      />
                    ) : (
                      <input
                        type="text"
                        value={newItem[column.key]}
                        onChange={(e) =>
                          handleNewItemChange(column.key, e.target.value)
                        }
                        style={inputStyle}
                      />
                    )
                  ) : (
                    ""
                  )}
                </td>
              ))}
              <td style={tableCellStyle}>
                <button onClick={handleSaveNewItem} style={buttonStyle}>
                  Save
                </button>
                <button onClick={() => setNewItem(null)} style={buttonStyle}>
                  Cancel
                </button>
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={columns.length + 1} style={tableCellStyle}>
              <button
                onClick={() => setNewItem({})}
                style={{ ...buttonStyle, width: "100%" }}
              >
                Add New Entry
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

const tableStyle: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  tableLayout: "fixed",
};

const tableHeaderStyle: CSSProperties = {
  padding: "12px",
  backgroundColor: "#D32F2F",
  color: "#FFFFFF",
  textAlign: "left",
  fontWeight: "bold",
};

const tableCellStyle: CSSProperties = {
  padding: "12px",
  borderBottom: "1px solid #777777",
  height: "40px",
  overflow: "hidden",
};

const buttonStyle: CSSProperties = {
  margin: "0 5px",
  padding: "8px",
  backgroundColor: "#D32F2F",
  color: "#FFFFFF",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const inputStyle: CSSProperties = {
  padding: "8px",
  borderRadius: "4px",
  border: "1px solid #cccccc",
};

const buttonContainerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "10px",
};

const wrapperStyle: CSSProperties = {
  overflowY: "auto",
  overflowX: "hidden",
};

export default EditableTable;
