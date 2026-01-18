
async function simulateError() {
  const projectResponse = await fetch('/api/projects');
  const projects = await projectResponse.json();
  
  if (projects.length === 0) {
    console.log("Nenhum projeto encontrado. Crie um projeto primeiro.");
    return;
  }

  const project = projects[0];
  console.log(`Simulando erro para o projeto: ${project.name} (${project.apiKey})`);

  const errorData = {
    apiKey: project.apiKey,
    type: 'error',
    message: 'Simulated Crash: ReferenceError: x is not defined',
    stackTrace: 'ReferenceError: x is not defined\n    at main.js:10:5\n    at startApp (app.js:2:1)',
    deviceInfo: {
      model: 'iPhone 15 Pro',
      os: 'iOS 17.2',
      battery: '85%'
    },
    platformInfo: {
      version: '1.0.0',
      build: '102'
    },
    tags: {
      env: 'production',
      user_tier: 'premium'
    },
    breadcrumbs: [
      { timestamp: new Date().toISOString(), category: 'ui', message: 'User clicked Login' },
      { timestamp: new Date().toISOString(), category: 'network', message: 'Auth request started' }
    ],
    occurredAt: new Date().toISOString()
  };

  const response = await fetch('/api/ingest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(errorData)
  });

  if (response.ok) {
    console.log("Erro enviado com sucesso!");
  } else {
    console.error("Falha ao enviar erro:", await response.text());
  }
}

simulateError();
