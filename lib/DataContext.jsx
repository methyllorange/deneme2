'use client';

import { createContext, useContext, useState, useMemo } from 'react';
import { provincesData } from './data/mockData';

const DataContext = createContext(null);

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [globalYear, setGlobalYear] = useState(2025);

    const currentProvinces = useMemo(() => {
        return provincesData.map(p => {
            const currentData = p.history[globalYear];
            const prevData = p.history[globalYear - 1] || p.history[globalYear];

            return {
                id: p.id,
                name: p.name,
                policy: p.policy,
                description: p.description,
                rankCurrent: currentData.rank,
                rankPrev: prevData.rank,
                grade: currentData.grade,
                scores: currentData.scores,
                prevScores: prevData.scores,
                subMetrics: currentData.subMetrics,
                historyScores: p.history,
            };
        }).sort((a, b) => a.rankCurrent - b.rankCurrent);
    }, [globalYear]);

    return (
        <DataContext.Provider value={{ globalYear, setGlobalYear, provinces: currentProvinces }}>
            {children}
        </DataContext.Provider>
    );
};
