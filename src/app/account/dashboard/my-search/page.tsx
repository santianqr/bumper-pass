import { api } from "@/trpc/server";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type PlateData = {
  plate: string;
  available: boolean;
  vehicleType: string;
  state: string;
  createdAt: Date;
};
import { unstable_noStore as noStore } from "next/cache";

export default async function MySearch() {
  noStore();
  const searchData: PlateData[] = await api.func.getSearch.query();

  return (
    <main className="space-y-8">
      <h2 className="col-span-2 scroll-m-20 text-center text-3xl font-semibold tracking-tight first:mt-0">
        Search Results
      </h2>
      <Table>
        <TableCaption>List of your plates from Search</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Plate</TableHead>
            <TableHead>Available</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {searchData.map((plate) => (
            <TableRow key={plate.plate}>
              <TableCell>{plate.plate}</TableCell>
              <TableCell>{plate.available ? "Yes" : "No"}</TableCell>
              <TableCell>{plate.vehicleType}</TableCell>
              <TableCell>{plate.state}</TableCell>
              <TableCell>{plate.createdAt.toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
