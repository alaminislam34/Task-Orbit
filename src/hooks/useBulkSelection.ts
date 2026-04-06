"use client";

import { useCallback, useMemo, useState } from "react";

export function useBulkSelection() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds],
  );

  const toggleOne = useCallback((id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }, []);

  const toggleMany = useCallback((ids: string[], checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => {
        if (checked) {
          next.add(id);
        } else {
          next.delete(id);
        }
      });
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const selectedCount = selectedIds.size;

  const getSelectedList = useCallback(() => Array.from(selectedIds), [selectedIds]);

  const getSelectionState = useCallback(
    (ids: string[]) => {
      if (!ids.length) {
        return {
          allSelected: false,
          someSelected: false,
        };
      }

      const selectedInScope = ids.filter((id) => selectedIds.has(id)).length;

      return {
        allSelected: selectedInScope === ids.length,
        someSelected: selectedInScope > 0 && selectedInScope < ids.length,
      };
    },
    [selectedIds],
  );

  return {
    selectedIds,
    selectedCount,
    isSelected,
    toggleOne,
    toggleMany,
    clearAll,
    getSelectedList,
    getSelectionState,
  };
}
