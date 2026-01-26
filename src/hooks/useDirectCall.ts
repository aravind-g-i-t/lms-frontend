import { useContext } from "react";
import { DirectCallContext } from "../context/DirectCallContext";

export const useDirectCall = () => useContext(DirectCallContext);
