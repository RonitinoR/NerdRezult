import React from 'react';
import JobCard from './JobCard';// Assuming you already have the JobCard component created
import "./JobCards.css";

const JobCards = () => {
  return (
    <main className="job-listings">
      <JobCard
        icon="FD"
        title="Senior Frontend Developer"
        tag="Featured"
        rate="$55/hr"
        highlights={[
          "Building sophisticated SaaS dashboard with real-time updates",
          "Complex state management and data visualization",
          "Integration with multiple third-party APIs",
        ]}
        requirements={["Vue.js", "Vuex", "TypeScript", "D3.js", "REST APIs"]}
        meta={{ posted: "2h ago", applicants: "10-20", rating: "4.8+", location: "Remote" }}
        theme="blue"
      />
      <JobCard
        icon="BD"
        title="Backend Developer"
        tag="Urgent"
        rate="$65/hr"
        highlights={[
          "Developing scalable microservices architecture",
          "Database optimization and performance tuning",
          "AWS cloud infrastructure management",
        ]}
        requirements={["Node.js", "MongoDB", "AWS", "Docker", "Kubernetes"]}
        meta={{ posted: "5h ago", applicants: "5-10", rating: "4.5+", location: "Remote" }}
        theme="red"
      />
      <JobCard
        icon="FD"
        title="Senior Frontend Developer"
        tag="Featured"
        rate="$55/hr"
        highlights={[
          "Building sophisticated SaaS dashboard with real-time updates",
          "Complex state management and data visualization",
          "Integration with multiple third-party APIs",
        ]}
        requirements={["Vue.js", "Vuex", "TypeScript", "D3.js", "REST APIs"]}
        meta={{ posted: "2h ago", applicants: "10-20", rating: "4.8+", location: "Remote" }}
        theme="blue"
      />
      <JobCard
        icon="BD"
        title="Backend Developer"
        tag="Urgent"
        rate="$65/hr"
        highlights={[
          "Developing scalable microservices architecture",
          "Database optimization and performance tuning",
          "AWS cloud infrastructure management",
        ]}
        requirements={["Node.js", "MongoDB", "AWS", "Docker", "Kubernetes"]}
        meta={{ posted: "5h ago", applicants: "5-10", rating: "4.5+", location: "Remote" }}
        theme="red"
      />
    </main>
  );
};

export default JobCards;