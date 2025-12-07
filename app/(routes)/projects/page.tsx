import Card from "@/components/Card";
import { projects } from "@/lib/constants";

export default function ProjectsPage() {
  return (
    <div>
      <h1 className='mb-8'>Projects</h1>
      <div className='grid sm:grid-cols-2 gap-x-6 gap-y-12 mb-3 pb-3'>
        {projects.map((project, i) => (
          <div key={i} className='sm:col-span-1'>
            <Card
              title={project.title}
              description={project.description}
              imgSrc={project.imgSrc}
              srcCode={project.links.srcCode}
              productionLink={project.links.production}
              demoLink={project.links.demo}
              stack={project.stack}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
