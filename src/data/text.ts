import { payments } from "./values";

export const heroText = {
    welcome: "Welcome to",
    tagline: "A Reward System Tailored for Parents",
    description: `Pointer is a web application designed to help parents encourage their children's good behavior through a rewarding points system. Children can earn points by completing various tasks, which can then be exchanged for valuable rewards, such as money, trips, and more. It's a fun and effective way to foster positive behavior and motivation.`,
    modal: {
      title: "Discover More About Pointer",
      sections: [
        {
          title: "How It Works",
          content: `Pointer operates on a straightforward points-based system. Parents assign tasks to their children, who earn points upon completion. These points are tracked in the app and can be redeemed for a range of rewards. This system not only motivates children to complete tasks but also teaches them the value of earning and managing rewards.`
        },
        {
          title: "Key Features",
          content: `Our app includes customizable reward options, a detailed tracking system, and a user-friendly interface. Parents can set up various task categories, monitor their child's progress, and adjust rewards based on performance. Pointer is designed to fit seamlessly into daily routines, making behavior management easier and more effective.`
        },
        {
          title: "Benefits",
          content: `Pointer helps parents foster positive behavior and motivation in their children. By earning and redeeming points, children learn valuable life skills such as goal-setting and responsibility. The app also provides a fun and engaging way to encourage task completion, making parenting both rewarding and enjoyable.`
        },
        {
          title: "Getting Started",
          content: `Getting started with Pointer is simple. Just sign up, and follow the easy steps to set up your profile. You'll be guided through adding tasks and rewards with our intuitive design, ensuring a smooth and seamless experience. Join other parents who are enhancing task management and rewards with ease and effectiveness.`
        }
      ]
    }
};
export const pricingOptions = [
  {
    title: "Free",
    price: "$0",
    description: "Get started with basic features to start rewarding your child for their efforts.",
    duration: "30 Days Free Trial",
    features: [
      "Monitor progress and activities",
      "Set up routines and tasks",
      "Award and track rewards"
    ]
  },
  {
    title: "Monthly",
    price: `$${payments.monthlyPlanPaymentInDollars}`,
    description: "Enhance your experience with additional features for a more effective reward system.",
    duration: "Per Month",
    features: [
      "Full access to all features",
      "Track multiple children's progress",
      "Access premium content"
    ]
  },
  {
    title: "Yearly",
    price: `$${payments.yearlyPlanPaymentInDollars}`,
    description: "Unlock the full potential of our app with advanced features and premium support.",
    duration: "Per Year",
    features: [
      "Full access to all features",
      "Save on annual billing",
      "Priority support and rewards"
    ]
  }
];

export const testimonials = [
  {
    quote: "This app has revolutionized the way I manage tasks with my kids. They are more responsible and motivated!",
    author: "Jane Doe",
    role: "Parent",
  },
  {
    quote: "The point system is genius. My kids love earning rewards for their hard work.",
    author: "John Smith",
    role: "Father of two",
  },
  {
    quote: "An excellent tool for teaching kids responsibility while making it fun.",
    author: "Emily Johnson",
    role: "Teacher",
  },
  {
    quote: "The best parenting tool I’ve come across. It’s so easy to use and incredibly effective.",
    author: "Michael Brown",
    role: "Father",
  },
  {
    quote: "I’ve noticed a big improvement in my children's behavior since we started using this app.",
    author: "Laura Wilson",
    role: "Mother of three",
  },
  {
    quote: "It’s rewarding for both parents and children. Highly recommend it!",
    author: "Chris Miller",
    role: "Parent",
  },
];

export const faqs = [
  {
    question: "What is Pointer?",
    answer: "Pointer is a modern web and mobile app designed to help parents effectively discipline their children by rewarding them with points for completing tasks. These points can be redeemed for exciting rewards such as money, vacations, and more."
  },
  {
    question: "How does the point system work?",
    answer: "Parents assign tasks to their children, and upon completion, children earn points. These points accumulate and can be redeemed for various rewards. The app also allows customization of tasks and rewards to better fit individual family needs."
  },
  {
    question: "Is there a free trial available?",
    answer: "Yes, all plans come with a 14-day free trial. You can explore all features and see if the app meets your needs before committing to a subscription."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Absolutely. You can cancel your subscription at any time, and you will not be charged for the next billing cycle. For more details, refer to our cancellation policy in the app settings."
  }
];
