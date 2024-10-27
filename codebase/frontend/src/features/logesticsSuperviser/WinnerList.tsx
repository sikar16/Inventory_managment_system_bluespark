import { Box } from "@mui/material";

import Loader from "../../component/Loading";
import WinnerListTable from "./WinnerTableList";
import { useGetAllWinnersQuery } from "../../services/winner_service";

const WinnerList = () => {
  const {
    data: winnerList,
    isLoading,
    isError,
    error,
    isFetching,
    isSuccess,
    isUninitialized,
  } = useGetAllWinnersQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>{error.toString()}</div>;
  }

  if (isFetching) {
    return <Loader />;
  }

  if (isUninitialized) {
    return <Loader />;
  }

  if (isSuccess)
    return (
      <>
        <p className="text-2xl font-semibold mb-3">Winner List</p>

        <div>
          <Box sx={{ position: "relative" }}></Box>
          <WinnerListTable winnerList={winnerList} />
        </div>
      </>
    );
};

export default WinnerList;
