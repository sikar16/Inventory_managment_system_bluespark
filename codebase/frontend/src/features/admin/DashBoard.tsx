import { Box } from "@mui/material";
import FormatterDemoNoSnap from "../../component/charts/bar_chat";
import BarsDataset from "../../component/charts/linear_graph";
import PieArcLabel from "../../component/charts/Pichart";
import {
  useLazyGetEmployeeTypeQuery,
  useLazyGetUserStatusTypeQuery,
  useLazyFinanceTotalPriceQuery,
  useLazyGetMonthlyInventoryStatsQuery,
} from "../../services/dashbord_service";

const dataKeys = [{ key: "value", label: "Number of employee" }];

const DashBoard = () => {
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <PieArcLabel triggerQuery={useLazyGetEmployeeTypeQuery} />
        <BarsDataset
          dataKeys={dataKeys}
          triggerQuery={useLazyGetUserStatusTypeQuery}
        />
      </Box>
      <Box sx={{ display: "flex" }}>
        <FormatterDemoNoSnap
          label="Number of inventory "
          triggerQuery={useLazyGetMonthlyInventoryStatsQuery}
        />
        <PieArcLabel triggerQuery={useLazyFinanceTotalPriceQuery} />
      </Box>
    </>
  );
};

export default DashBoard;
