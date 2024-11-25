import React, { useState } from "react";
import { Table, TableBody, TableContainer, Paper, Box } from "@mui/material";
import DataTableRow from "../molecules/TableRow";
import TableHeader from "../molecules/TableHeader";
import ColumnVisibilityControl from "../molecules/ColumnVisibilityControl";
import ProfessorFilters from "./ProfessorFilters";
import { Professor } from "../../types/Professors"; // Importando o tipo correto

interface ProfessorTableProps {
  professors: Professor[];
  visibleColumns: string[];
  setVisibleColumns: (columns: string[]) => void;
  COLUMN_OPTIONS: string[];
  COLUMN_LABELS: Record<string, string>;
}

export default function ProfessorTable({
  professors,
  visibleColumns,
  setVisibleColumns,
  COLUMN_OPTIONS,
  COLUMN_LABELS,
}: ProfessorTableProps) {
  const [filters, setFilters] = useState<{
    search: string;
    courses: string[];
    titulacoes: string[];
    status: boolean;
  }>({
    search: "",
    courses: [],
    titulacoes: [],
    status: true,
  });

  const filteredProfessors = professors.filter((professor) => {
    const matchesSearch =
      professor.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      professor.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      professor.registrationNumber.includes(filters.search);

    const matchesCourses =
      filters.courses.length === 0 ||
      filters.courses.some((course) => professor.courses.includes(course));

    const matchesTitration =
      filters.titulacoes.length === 0 ||
      filters.titulacoes.includes(professor.titration);

    const matchesStatus =
      !filters.status || professor.activityStatus === "Ativo";

    return matchesSearch && matchesCourses && matchesTitration && matchesStatus;
  });

  const handleColumnVisibilityChange = (selectedColumns: string[]) => {
    const updatedColumns = [
      ...selectedColumns.filter((col) => col !== "actions"), 
      "actions", 
    ];
    setVisibleColumns(updatedColumns);
  };

  return (
    <Box>
      <ProfessorFilters
        filters={filters}
        setFilters={setFilters}
        availableCourses={["DSM", "CO", "CDN"]}
        availableTitulacoes={["Doutor", "Mestre"]}
      />

      <TableContainer
        component={Paper}
        sx={{
          width: "100%",
          maxWidth: 1400,
          margin: "0 auto",
          borderRadius: 2,
          boxShadow: 3,
          mt: 4,
          overflowX: "auto",
        }}
      >
        <Table>
          <TableHeader visibleColumns={visibleColumns} />
          <TableBody>
            {filteredProfessors.map((professor, index) => (
              <DataTableRow
                key={index}
                data={professor}
                visibleColumns={visibleColumns}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ColumnVisibilityControl
        visibleColumns={visibleColumns}
        setVisibleColumns={handleColumnVisibilityChange}
        COLUMN_OPTIONS={COLUMN_OPTIONS}
        COLUMN_LABELS={COLUMN_LABELS}
      />
    </Box>
  );
}
