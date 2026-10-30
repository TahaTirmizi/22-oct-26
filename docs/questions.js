// GRE Quant diagnostic question bank (original questions written in GRE style).
//
// Fields:
//   topic       one of "Arithmetic", "Algebra", "Geometry", "Data Analysis"
//   difficulty  1 = easy, 2 = medium, 3 = hard (used to weight the score)
//   type        "mc"  multiple choice, one answer      -> answer: index into choices
//               "ma"  multiple choice, select all      -> answer: array of indices
//               "qc"  quantitative comparison          -> answer: 0 A greater, 1 B greater, 2 equal, 3 cannot tell
//               "num" numeric entry                    -> answer: number or "a/b" string
//   prompt      HTML shown above the answer area
//   explain     HTML shown on the review screen

window.QUESTIONS = [
  {
    topic: "Arithmetic", difficulty: 1, type: "mc",
    prompt: "What is 15% of 240?",
    choices: ["24", "30", "36", "40", "48"],
    answer: 2,
    explain: "0.15 × 240 = 36."
  },
  {
    topic: "Arithmetic", difficulty: 1, type: "qc",
    prompt: "",
    quantityA: "3/7", quantityB: "0.43",
    answer: 1,
    explain: "3/7 = 0.42857…, which is less than 0.43."
  },
  {
    topic: "Algebra", difficulty: 1, type: "num",
    prompt: "If 3<i>x</i> − 7 = 11, what is the value of <i>x</i>?",
    answer: 6,
    explain: "3<i>x</i> = 18, so <i>x</i> = 6."
  },
  {
    topic: "Geometry", difficulty: 1, type: "mc",
    prompt: "A rectangle has a perimeter of 30 and a length of 9. What is its area?",
    choices: ["45", "54", "60", "72", "81"],
    answer: 1,
    explain: "2(9 + <i>w</i>) = 30 gives <i>w</i> = 6. Area = 9 × 6 = 54."
  },
  {
    topic: "Data Analysis", difficulty: 1, type: "mc",
    prompt: "What is the arithmetic mean of 4, 8, 10, 14, and 19?",
    choices: ["10", "11", "12", "13", "14"],
    answer: 1,
    explain: "Sum = 55, and 55 ÷ 5 = 11."
  },
  {
    topic: "Arithmetic", difficulty: 2, type: "num",
    prompt: "The price of a jacket is increased by 20%, and then the new price is decreased by 20%. The final price is what percent of the original price?",
    unit: "%",
    answer: 96,
    explain: "1.2 × 0.8 = 0.96, so the final price is 96% of the original."
  },
  {
    topic: "Algebra", difficulty: 2, type: "qc",
    prompt: "<i>x</i><sup>2</sup> = 16",
    quantityA: "<i>x</i>", quantityB: "3",
    answer: 3,
    explain: "<i>x</i> can be 4 or −4. One is greater than 3 and the other is less, so the relationship cannot be determined."
  },
  {
    topic: "Algebra", difficulty: 2, type: "mc",
    prompt: "If 4<sup><i>x</i></sup> = 8<sup><i>x</i> − 1</sup>, what is the value of <i>x</i>?",
    choices: ["1", "2", "3", "4", "6"],
    answer: 2,
    explain: "Write both sides as powers of 2: 2<sup>2<i>x</i></sup> = 2<sup>3<i>x</i> − 3</sup>. So 2<i>x</i> = 3<i>x</i> − 3 and <i>x</i> = 3."
  },
  {
    topic: "Geometry", difficulty: 2, type: "mc",
    prompt: "A right triangle has legs of length 6 and 8. What is the length of the altitude drawn from the right angle to the hypotenuse?",
    choices: ["4", "4.8", "5", "5.6", "7"],
    answer: 1,
    explain: "The hypotenuse is 10. Area = ½ × 6 × 8 = 24 = ½ × 10 × <i>h</i>, so <i>h</i> = 4.8."
  },
  {
    topic: "Data Analysis", difficulty: 2, type: "num",
    prompt: "A bag contains 4 red marbles and 6 blue marbles. Two marbles are drawn at random without replacement. What is the probability that both are red?<br><span class=\"hint\">Give your answer as a fraction.</span>",
    answer: "2/15",
    explain: "(4/10) × (3/9) = 12/90 = 2/15."
  },
  {
    topic: "Arithmetic", difficulty: 2, type: "ma",
    prompt: "Which of the following are divisors of 84?",
    choices: ["6", "8", "12", "14", "18", "21"],
    answer: [0, 2, 3, 5],
    explain: "84 = 2<sup>2</sup> × 3 × 7. 6, 12, 14, and 21 divide it. 8 needs 2<sup>3</sup> and 18 needs 3<sup>2</sup>, so neither works."
  },
  {
    topic: "Data Analysis", difficulty: 2, type: "qc",
    prompt: "Data set: 3, 9, 4, 12, 7, 5, 9",
    quantityA: "The median of the data set", quantityB: "The mean of the data set",
    answer: 2,
    explain: "Sorted: 3, 4, 5, 7, 9, 9, 12, so the median is 7. The sum is 49, and 49 ÷ 7 = 7. They are equal."
  },
  {
    topic: "Algebra", difficulty: 2, type: "mc",
    prompt: "Machine A can complete an order in 6 hours, and Machine B can complete the same order in 3 hours. Working together at their constant rates, how many hours will the two machines take to complete the order?",
    choices: ["1.5", "2", "2.5", "3", "4.5"],
    answer: 1,
    explain: "Combined rate = 1/6 + 1/3 = 1/2 order per hour, so it takes 2 hours."
  },
  {
    topic: "Geometry", difficulty: 2, type: "qc",
    prompt: "A circle has a circumference of 10π.",
    quantityA: "The area of the circle", quantityB: "75",
    answer: 0,
    explain: "<i>r</i> = 5, so the area is 25π ≈ 78.5, which is greater than 75."
  },
  {
    topic: "Geometry", difficulty: 2, type: "qc",
    prompt: "Two sides of a triangle have lengths 7 and 10. The third side has length <i>x</i>.",
    quantityA: "<i>x</i>", quantityB: "17",
    answer: 1,
    explain: "By the triangle inequality, <i>x</i> &lt; 7 + 10 = 17."
  },
  {
    topic: "Geometry", difficulty: 2, type: "num",
    prompt: "A line passes through the points (1, 2) and (4, 11) in the <i>xy</i>-plane. What is the <i>x</i>-intercept of the line?<br><span class=\"hint\">Give your answer as a fraction.</span>",
    answer: "1/3",
    explain: "Slope = (11 − 2)/(4 − 1) = 3, so <i>y</i> = 3<i>x</i> − 1. Setting <i>y</i> = 0 gives <i>x</i> = 1/3."
  },
  {
    topic: "Arithmetic", difficulty: 3, type: "num",
    prompt: "What is the remainder when 7<sup>50</sup> is divided by 5?",
    answer: 4,
    explain: "Remainders of powers of 7 when divided by 5 repeat in a cycle of four: 2, 4, 3, 1. Since 50 = 4 × 12 + 2, the remainder is the second value in the cycle, 4."
  },
  {
    topic: "Algebra", difficulty: 3, type: "ma",
    prompt: "Which of the following values of <i>x</i> satisfy <i>x</i><sup>2</sup> − 5<i>x</i> − 6 &lt; 0?",
    choices: ["−2", "−1", "0", "2.5", "5.9", "6"],
    answer: [2, 3, 4],
    explain: "(<i>x</i> − 6)(<i>x</i> + 1) &lt; 0 when −1 &lt; <i>x</i> &lt; 6. The endpoints −1 and 6 give 0, which is not less than 0."
  },
  {
    topic: "Geometry", difficulty: 3, type: "mc",
    prompt: "A square is inscribed in a circle of radius 5. What is the area of the region inside the circle but outside the square?",
    choices: ["25π − 25", "25π − 50", "25π − 100", "50π − 50", "10π − 50"],
    answer: 1,
    explain: "The square's diagonal equals the diameter, 10, so its area is 10<sup>2</sup>/2 = 50. The circle's area is 25π, so the region is 25π − 50."
  },
  {
    topic: "Data Analysis", difficulty: 3, type: "mc",
    prompt: "A committee of 3 people is to be chosen from 5 men and 4 women. How many different committees include at least one woman?",
    choices: ["10", "60", "74", "80", "84"],
    answer: 2,
    explain: "There are C(9, 3) = 84 committees in total and C(5, 3) = 10 with only men, so 84 − 10 = 74."
  },
  {
    topic: "Data Analysis", difficulty: 3, type: "num",
    prompt: "A data set has a mean of 50 and a standard deviation of 10. Every value in the set is multiplied by 3, and then 5 is added to each result. What is the standard deviation of the new data set?",
    answer: 30,
    explain: "Multiplying every value by 3 multiplies the standard deviation by 3. Adding a constant shifts the values without changing their spread. So the new standard deviation is 30."
  },
  {
    topic: "Arithmetic", difficulty: 3, type: "mc",
    prompt: "How many integers from 1 to 1,000, inclusive, are divisible by neither 4 nor 6?",
    choices: ["583", "625", "667", "750", "833"],
    answer: 2,
    explain: "250 are divisible by 4, 166 by 6, and 83 by both (that is, by 12). So 250 + 166 − 83 = 333 are divisible by 4 or 6, and 1,000 − 333 = 667 are divisible by neither."
  },
  {
    topic: "Data Analysis", difficulty: 3, type: "ma",
    prompt: "The table shows the scores of 40 students on a quiz.<table class=\"data\"><tr><th>Score</th><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td></tr><tr><th>Students</th><td>4</td><td>10</td><td>12</td><td>8</td><td>6</td></tr></table>Which of the following statements must be true?",
    choices: [
      "The median score is 3.",
      "The mean score is greater than the median score.",
      "More than half of the students scored 3 or higher.",
      "The range of the scores is 5."
    ],
    answer: [0, 1, 2],
    explain: "The 20th and 21st scores are both 3, so the median is 3. Mean = (4 + 20 + 36 + 32 + 30)/40 = 3.05, which is greater than 3. 26 of the 40 students scored 3 or higher. The range is 5 − 1 = 4, not 5."
  },
  {
    topic: "Algebra", difficulty: 3, type: "mc",
    prompt: "If <i>x</i> + 1/<i>x</i> = 5, what is the value of <i>x</i><sup>2</sup> + 1/<i>x</i><sup>2</sup>?",
    choices: ["10", "21", "23", "25", "27"],
    answer: 2,
    explain: "Square both sides: <i>x</i><sup>2</sup> + 2 + 1/<i>x</i><sup>2</sup> = 25, so <i>x</i><sup>2</sup> + 1/<i>x</i><sup>2</sup> = 23."
  }
];
