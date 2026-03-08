describe("Profitability Calculations", () => {
  // Unit tests
  const calcProfitability = (
    revenue: number,
    entries: { hours: number; cost_per_hour: number }[],
    estimated_hours?: number
  ) => {
    const actual_hours = entries.reduce((sum, e) => sum + e.hours, 0);
    const delivery_cost = entries.reduce((sum, e) => sum + e.hours * e.cost_per_hour, 0);
    const gross_margin = revenue - delivery_cost;
    const margin_pct = revenue > 0 ? (gross_margin / revenue) * 100 : 0;
    const hours_variance_pct =
      estimated_hours && estimated_hours > 0
        ? ((actual_hours - estimated_hours) / estimated_hours) * 100
        : null;

    return {
      actual_hours,
      delivery_cost,
      gross_margin,
      margin_pct: Math.round(margin_pct * 100) / 100,
      hours_variance_pct: hours_variance_pct !== null
        ? Math.round(hours_variance_pct * 100) / 100
        : null,
    };
  };

  describe("delivery_cost", () => {
    it("calculates correctly with single role", () => {
      const result = calcProfitability(10000, [{ hours: 20, cost_per_hour: 46.875 }]);
      expect(result.delivery_cost).toBeCloseTo(937.5);
    });

    it("calculates correctly with multiple roles", () => {
      const result = calcProfitability(10000, [
        { hours: 20, cost_per_hour: 46.875 },
        { hours: 10, cost_per_hour: 31.25 },
      ]);
      expect(result.delivery_cost).toBeCloseTo(1250);
    });

    it("returns 0 with no time entries", () => {
      const result = calcProfitability(10000, []);
      expect(result.delivery_cost).toBe(0);
    });
  });

  describe("gross_margin", () => {
    it("is positive when revenue exceeds cost", () => {
      const result = calcProfitability(10000, [{ hours: 20, cost_per_hour: 46.875 }]);
      expect(result.gross_margin).toBeGreaterThan(0);
    });

    it("is negative when cost exceeds revenue", () => {
      const result = calcProfitability(500, [{ hours: 20, cost_per_hour: 46.875 }]);
      expect(result.gross_margin).toBeLessThan(0);
    });

    it("equals revenue when no time entries logged", () => {
      const result = calcProfitability(10000, []);
      expect(result.gross_margin).toBe(10000);
    });
  });

  describe("margin_pct", () => {
    it("calculates correct percentage", () => {
      const result = calcProfitability(10000, [{ hours: 20, cost_per_hour: 46.875 }]);
      expect(result.margin_pct).toBeCloseTo(90.63);
    });

    it("returns 0 when revenue is 0", () => {
      const result = calcProfitability(0, [{ hours: 10, cost_per_hour: 50 }]);
      expect(result.margin_pct).toBe(0);
    });

    it("returns 100 when delivery cost is 0", () => {
      const result = calcProfitability(10000, []);
      expect(result.margin_pct).toBe(100);
    });
  });

  describe("hours_variance_pct", () => {
    it("returns negative when under estimated hours", () => {
      const result = calcProfitability(10000, [{ hours: 80, cost_per_hour: 50 }], 100);
      expect(result.hours_variance_pct).toBe(-20);
    });

    it("returns positive when over estimated hours", () => {
      const result = calcProfitability(10000, [{ hours: 120, cost_per_hour: 50 }], 100);
      expect(result.hours_variance_pct).toBe(20);
    });

    it("returns null when no estimated hours provided", () => {
      const result = calcProfitability(10000, [{ hours: 80, cost_per_hour: 50 }]);
      expect(result.hours_variance_pct).toBeNull();
    });

    it("returns 0 when actual equals estimated", () => {
      const result = calcProfitability(10000, [{ hours: 100, cost_per_hour: 50 }], 100);
      expect(result.hours_variance_pct).toBe(0);
    });
  });
});