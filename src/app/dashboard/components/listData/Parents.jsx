"use client";

import React from "react";
import dynamic from "next/dynamic";

import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  AddOutlined,
  DeleteForeverOutlined,
  EditOutlined,
} from "@mui/icons-material";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const Children = dynamic(() => import("./Children"));

import { useDataContext } from "../List";
import { useListContext } from "../ListTable";

export default function Parents({ category }) {
  const { handleAdd, handleEdit, handleDelete, data } = useDataContext();

  const { parDropDown, par } = useListContext();

  const parents = data[1].sort((a, b) => {
    const name1 = a.name.toUpperCase();
    const name2 = b.name.toUpperCase();

    if (name1 < name2) return -1;
    else if (name1 > name2) return 1;
    else return 0;
  });

  return (
    <Table size="medium" aria-label="parents">
      <TableHead>
        <TableRow>
          <TableCell></TableCell>
          <TableCell>
            <p className="font-bold">Parent Name</p>
          </TableCell>
          <TableCell align="left">
            <p className="font-bold">Description</p>
          </TableCell>
          <TableCell align="center"></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {parents.map(
          (parent) =>
            parent.CategoryId == category.id && (
              <React.Fragment key={parent.id}>
                <TableRow>
                  <TableCell>
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => parDropDown(parent.id)}
                    >
                      {par.id === parent.id && par.open ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {parent.name}
                  </TableCell>
                  <TableCell>{parent.description}</TableCell>
                  <TableCell align="center">
                    <div className="flex justify-evenly items-center">
                      <button
                        name="add"
                        className="text-green-500"
                        onClick={() =>
                          handleAdd("children", category.id, parent.id)
                        }
                      >
                        <AddOutlined />
                      </button>
                      <button
                        name="edit"
                        onClick={() => handleEdit("parents", parent)}
                        className="text-blue-500"
                      >
                        <EditOutlined />
                      </button>
                      <button
                        name="delete"
                        onClick={() => handleDelete("parents", parent)}
                        className="text-red-500"
                      >
                        <DeleteForeverOutlined />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{
                      paddingBottom: 0,
                      paddingTop: 0,
                    }}
                    colSpan={6}
                  >
                    <Collapse
                      in={par.id === parent.id && par.open === true}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box sx={{ margin: 1 }}>
                        <Children category={category} parent={parent} />
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            )
        )}
      </TableBody>
    </Table>
  );
}
