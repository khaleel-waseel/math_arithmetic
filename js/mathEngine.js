// Math Problem Generator with strict carry/borrow classification & step-by-step guidance

class MathEngine {
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Generate an Addition problem with or without carry
     * @param {Object} options { carry: boolean, digits: 1|2|3|4 }
     */
    static generateAddition(options = { carry: false, digits: 2 }) {
        const digits = options.digits || 2;
        const carry = !!options.carry;

        if (digits === 1) {
            if (!carry) {
                // Sum <= 9
                const a = this.randomInt(1, 8);
                const b = this.randomInt(1, 9 - a);
                return this.formatProblem(a, b, '+', { carryNeeded: false });
            } else {
                // Sum >= 10 (1-digit + 1-digit with carry -> 2-digit output)
                const a = this.randomInt(2, 9);
                const b = this.randomInt(10 - a, 9);
                return this.formatProblem(a, b, '+', { carryNeeded: true, carryCols: [true] });
            }
        }

        if (digits === 2) {
            if (!carry) {
                // Tens: sum <= 9, Ones: sum <= 9
                const aTens = this.randomInt(1, 7);
                const bTens = this.randomInt(1, 8 - aTens);
                const aOnes = this.randomInt(1, 8);
                const bOnes = this.randomInt(0, 9 - aOnes);

                const top = aTens * 10 + aOnes;
                const bottom = bTens * 10 + bOnes;
                return this.formatProblem(top, bottom, '+', { carryNeeded: false });
            } else {
                // 2-digit addition with carry. 50% chance of 3-digit total output (e.g. 78 + 65 = 143)
                const producesThreeDigits = Math.random() > 0.45;

                const aOnes = this.randomInt(3, 9);
                const bOnes = this.randomInt(10 - aOnes, 9);

                let aTens, bTens;
                if (producesThreeDigits) {
                    // Tens sum + 1 >= 10
                    aTens = this.randomInt(5, 9);
                    bTens = this.randomInt(10 - aTens, 9);
                } else {
                    // Tens sum + 1 <= 9
                    aTens = this.randomInt(1, 5);
                    bTens = this.randomInt(1, 8 - aTens);
                }

                const top = aTens * 10 + aOnes;
                const bottom = bTens * 10 + bOnes;
                return this.formatProblem(top, bottom, '+', { 
                    carryNeeded: true, 
                    carryCols: [true, producesThreeDigits] 
                });
            }
        }

        if (digits === 3) {
            if (!carry) {
                const aH = this.randomInt(1, 6);
                const bH = this.randomInt(1, 8 - aH);
                const aT = this.randomInt(1, 7);
                const bT = this.randomInt(0, 8 - aT);
                const aO = this.randomInt(1, 8);
                const bO = this.randomInt(0, 9 - aO);

                const top = aH * 100 + aT * 10 + aO;
                const bottom = bH * 100 + bT * 10 + bO;
                return this.formatProblem(top, bottom, '+', { carryNeeded: false });
            } else {
                // Carry at ones or tens
                const aO = this.randomInt(4, 9);
                const bO = this.randomInt(10 - aO, 9);
                const aT = this.randomInt(2, 7);
                const bT = this.randomInt(1, 8 - aT);
                const aH = this.randomInt(1, 5);
                const bH = this.randomInt(1, 4);

                const top = aH * 100 + aT * 10 + aO;
                const bottom = bH * 100 + bT * 10 + bO;
                return this.formatProblem(top, bottom, '+', { carryNeeded: true, carryCols: [true, false, false] });
            }
        }

        if (digits >= 4) {
            if (!carry) {
                const aTh = this.randomInt(1, 5);
                const bTh = this.randomInt(1, 8 - aTh);
                const aH = this.randomInt(1, 6);
                const bH = this.randomInt(0, 8 - aH);
                const aT = this.randomInt(1, 7);
                const bT = this.randomInt(0, 8 - aT);
                const aO = this.randomInt(1, 8);
                const bO = this.randomInt(0, 9 - aO);

                const top = aTh * 1000 + aH * 100 + aT * 10 + aO;
                const bottom = bTh * 1000 + bH * 100 + bT * 10 + bO;
                return this.formatProblem(top, bottom, '+', { carryNeeded: false });
            } else {
                const aO = this.randomInt(4, 9);
                const bO = this.randomInt(10 - aO, 9);
                const aT = this.randomInt(2, 8);
                const bT = this.randomInt(1, 7);
                const aH = this.randomInt(1, 6);
                const bH = this.randomInt(1, 5);
                const aTh = this.randomInt(1, 4);
                const bTh = this.randomInt(1, 4);

                const top = aTh * 1000 + aH * 100 + aT * 10 + aO;
                const bottom = bTh * 1000 + bH * 100 + bT * 10 + bO;
                return this.formatProblem(top, bottom, '+', { carryNeeded: true, carryCols: [true, false, false, false] });
            }
        }

        // Fallback
        return this.formatProblem(15, 12, '+', { carryNeeded: false });
    }

    /**
     * Generate a Subtraction problem with or without borrow
     * @param {Object} options { borrow: boolean, digits: 1|2|3|4 }
     */
    static generateSubtraction(options = { borrow: false, digits: 2 }) {
        const digits = options.digits || 2;
        const borrow = !!options.borrow;

        if (digits === 1) {
            // 1-digit subtraction
            const a = this.randomInt(3, 9);
            const b = this.randomInt(1, a - 1);
            return this.formatProblem(a, b, '-', { borrowNeeded: false });
        }

        if (digits === 2) {
            if (!borrow) {
                // Top ones >= bottom ones, Top tens >= bottom tens
                const aTens = this.randomInt(2, 9);
                const bTens = this.randomInt(1, aTens - 1);
                const aOnes = this.randomInt(2, 9);
                const bOnes = this.randomInt(0, aOnes);

                const top = aTens * 10 + aOnes;
                const bottom = bTens * 10 + bOnes;
                return this.formatProblem(top, bottom, '-', { borrowNeeded: false });
            } else {
                // Top ones < bottom ones (Guaranteed Borrowing)
                const aTens = this.randomInt(2, 9);
                const bTens = this.randomInt(1, aTens - 1);
                const aOnes = this.randomInt(0, 6);
                const bOnes = this.randomInt(aOnes + 1, 9);

                const top = aTens * 10 + aOnes;
                const bottom = bTens * 10 + bOnes;
                return this.formatProblem(top, bottom, '-', { borrowNeeded: true, borrowCols: [true, false] });
            }
        }

        if (digits === 3) {
            if (!borrow) {
                const aH = this.randomInt(3, 9);
                const bH = this.randomInt(1, aH - 1);
                const aT = this.randomInt(2, 9);
                const bT = this.randomInt(0, aT);
                const aO = this.randomInt(2, 9);
                const bO = this.randomInt(0, aO);

                const top = aH * 100 + aT * 10 + aO;
                const bottom = bH * 100 + bT * 10 + bO;
                return this.formatProblem(top, bottom, '-', { borrowNeeded: false });
            } else {
                // Borrow at ones
                const aH = this.randomInt(3, 9);
                const bH = this.randomInt(1, aH - 1);
                const aT = this.randomInt(2, 8);
                const bT = this.randomInt(1, aT - 1);
                const aO = this.randomInt(0, 5);
                const bO = this.randomInt(aO + 2, 9);

                const top = aH * 100 + aT * 10 + aO;
                const bottom = bH * 100 + bT * 10 + bO;
                return this.formatProblem(top, bottom, '-', { borrowNeeded: true, borrowCols: [true, false, false] });
            }
        }

        if (digits >= 4) {
            if (!borrow) {
                const aTh = this.randomInt(3, 9);
                const bTh = this.randomInt(1, aTh - 1);
                const aH = this.randomInt(2, 9);
                const bH = this.randomInt(0, aH);
                const aT = this.randomInt(2, 9);
                const bT = this.randomInt(0, aT);
                const aO = this.randomInt(2, 9);
                const bO = this.randomInt(0, aO);

                const top = aTh * 1000 + aH * 100 + aT * 10 + aO;
                const bottom = bTh * 1000 + bH * 100 + bT * 10 + bO;
                return this.formatProblem(top, bottom, '-', { borrowNeeded: false });
            } else {
                const aTh = this.randomInt(3, 9);
                const bTh = this.randomInt(1, aTh - 1);
                const aH = this.randomInt(2, 8);
                const bH = this.randomInt(1, aH);
                const aT = this.randomInt(2, 8);
                const bT = this.randomInt(1, aT - 1);
                const aO = this.randomInt(0, 5);
                const bO = this.randomInt(aO + 2, 9);

                const top = aTh * 1000 + aH * 100 + aT * 10 + aO;
                const bottom = bTh * 1000 + bH * 100 + bT * 10 + bO;
                return this.formatProblem(top, bottom, '-', { borrowNeeded: true, borrowCols: [true, false, false, false] });
            }
        }

        return this.formatProblem(35, 12, '-', { borrowNeeded: false });
    }

    /**
     * Formats arithmetic object for UI rendering & step validation
     */
    static formatProblem(top, bottom, operator, meta = {}) {
        const answer = operator === '+' ? top + bottom : top - bottom;
        const topStr = top.toString();
        const bottomStr = bottom.toString();
        const answerStr = answer.toString();
        const maxCols = Math.max(topStr.length, bottomStr.length, answerStr.length);

        return {
            top,
            bottom,
            operator,
            answer,
            answerStr,
            topStr,
            bottomStr,
            maxCols,
            meta
        };
    }

    /**
     * Generate problem based on current stage definition & settings overrides
     */
    static generateForStage(stageDef, digitPreference = null) {
        const digits = digitPreference || stageDef.digits || 2;
        switch (stageDef.operationType) {
            case 'add_no_carry':
                return this.generateAddition({ carry: false, digits });
            case 'add_carry':
                return this.generateAddition({ carry: true, digits });
            case 'sub_no_borrow':
                return this.generateSubtraction({ borrow: false, digits });
            case 'sub_borrow':
                return this.generateSubtraction({ borrow: true, digits });
            case 'mixed_no_regroup':
                return Math.random() > 0.5
                    ? this.generateAddition({ carry: false, digits })
                    : this.generateSubtraction({ borrow: false, digits });
            case 'mixed_regroup':
                return Math.random() > 0.5
                    ? this.generateAddition({ carry: true, digits })
                    : this.generateSubtraction({ borrow: true, digits });
            case 'all_mixed':
            default:
                const roll = Math.random();
                if (roll < 0.25) return this.generateAddition({ carry: false, digits });
                if (roll < 0.50) return this.generateAddition({ carry: true, digits });
                if (roll < 0.75) return this.generateSubtraction({ borrow: false, digits });
                return this.generateSubtraction({ borrow: true, digits });
        }
    }
}

window.MathEngine = MathEngine;
