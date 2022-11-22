import { LanguageList, ConfigList } from "../const";

export type LangEnv = typeof LanguageList[number] | "";

export type ConfigEnv = typeof ConfigList[number] | "";
