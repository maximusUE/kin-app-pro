import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const STATUS_FILE = '/Users/cesarue/Desktop/Proyecto YouTube/scratch/run_status.json';
const LOGS_DIR = '/Users/cesarue/Desktop/Proyecto YouTube/scratch/logs';

function getStatus() {
  if (!fs.existsSync(STATUS_FILE)) {
    return {
      trends: { status: 'idle', pid: null, startTime: null, endTime: null },
      documentary: { status: 'idle', pid: null, startTime: null, endTime: null },
      factory: { status: 'idle', pid: null, startTime: null, endTime: null },
      bot: { status: 'idle', pid: null, startTime: null, endTime: null },
    };
  }
  try {
    const raw = fs.readFileSync(STATUS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    // Ensure all keys are defined
    return {
      trends: parsed.trends || { status: 'idle', pid: null, startTime: null, endTime: null },
      documentary: parsed.documentary || { status: 'idle', pid: null, startTime: null, endTime: null },
      factory: parsed.factory || { status: 'idle', pid: null, startTime: null, endTime: null },
      bot: parsed.bot || { status: 'idle', pid: null, startTime: null, endTime: null },
    };
  } catch {
    return {
      trends: { status: 'idle', pid: null, startTime: null, endTime: null },
      documentary: { status: 'idle', pid: null, startTime: null, endTime: null },
      factory: { status: 'idle', pid: null, startTime: null, endTime: null },
      bot: { status: 'idle', pid: null, startTime: null, endTime: null },
    };
  }
}

function updateStatus(key: string, data: any) {
  const current = getStatus();
  current[key] = { ...current[key], ...data };
  if (!fs.existsSync(path.dirname(STATUS_FILE))) {
    fs.mkdirSync(path.dirname(STATUS_FILE), { recursive: true });
  }
  fs.writeFileSync(STATUS_FILE, JSON.stringify(current, null, 2), 'utf-8');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const script = searchParams.get('script'); // 'trends', 'documentary', 'factory', or 'bot'

  if (!script) {
    // Check if running processes are actually alive, update status if not
    const current = getStatus();
    let updated = false;
    for (const [key, value] of Object.entries(current)) {
      if (value.status === 'running' && value.pid) {
        try {
          process.kill(value.pid, 0); // test if process is running
        } catch {
          // Process died
          value.status = 'idle';
          value.pid = null;
          value.endTime = new Date().toISOString();
          updated = true;
        }
      }
    }
    if (updated) {
      fs.writeFileSync(STATUS_FILE, JSON.stringify(current, null, 2), 'utf-8');
    }
    return NextResponse.json(current);
  }

  const status = getStatus()[script] || { status: 'idle' };
  
  // Verify if it is running
  if (status.status === 'running' && status.pid) {
    try {
      process.kill(status.pid, 0);
    } catch {
      status.status = 'idle';
      status.pid = null;
      status.endTime = new Date().toISOString();
      updateStatus(script, status);
    }
  }

  const logFile = path.join(LOGS_DIR, `${script}.log`);
  let logs = '';

  if (fs.existsSync(logFile)) {
    // Read last 200 lines of log
    const content = fs.readFileSync(logFile, 'utf-8');
    const lines = content.split('\n');
    logs = lines.slice(-200).join('\n');
  }

  return NextResponse.json({ ...status, logs });
}

export async function POST(request: Request) {
  try {
    const { script, action, options } = await request.json();
    const validScripts = ['trends', 'documentary', 'factory', 'bot'];
    
    if (!script || !validScripts.includes(script)) {
      return NextResponse.json({ error: 'Invalid script name' }, { status: 400 });
    }

    const currentStatus = getStatus()[script] || { status: 'idle', pid: null };

    // Handle STOP action
    if (action === 'stop') {
      if (currentStatus.status !== 'running' || !currentStatus.pid) {
        return NextResponse.json({ error: 'Process is not running' }, { status: 400 });
      }
      try {
        process.kill(currentStatus.pid, 'SIGTERM');
      } catch (err) {
        console.warn(`Failed to kill process ${currentStatus.pid}:`, err);
      }
      const endTime = new Date().toISOString();
      updateStatus(script, { status: 'idle', pid: null, endTime });
      
      const logFile = path.join(LOGS_DIR, `${script}.log`);
      fs.appendFileSync(logFile, `\n=== PROCESO DETENIDO MANUALMENTE: ${new Date().toLocaleString()} ===\n`);
      
      return NextResponse.json({ success: true });
    }

    // Handle START action (default)
    // Check if process is already running and alive
    if (currentStatus.status === 'running' && currentStatus.pid) {
      let isAlive = false;
      try {
        process.kill(currentStatus.pid, 0);
        isAlive = true;
      } catch {
        isAlive = false;
      }
      if (isAlive) {
        return NextResponse.json({ error: 'Script is already running' }, { status: 400 });
      }
    }

    if (!fs.existsSync(LOGS_DIR)) {
      fs.mkdirSync(LOGS_DIR, { recursive: true });
    }

    const logFile = path.join(LOGS_DIR, `${script}.log`);
    fs.writeFileSync(logFile, `=== INICIANDO EJECUCIÓN: ${new Date().toLocaleString()} ===\n`, 'utf-8');

    let scriptPath = '';
    if (script === 'trends') scriptPath = 'src/scripts/trendAgent.ts';
    else if (script === 'documentary') scriptPath = 'src/scripts/documentaryAgent.ts';
    else if (script === 'factory') scriptPath = 'src/scripts/testRunner.ts';
    else if (script === 'bot') scriptPath = 'src/scripts/telegramBot.ts';

    const absoluteScriptPath = path.resolve('/Users/cesarue/Desktop/Proyecto YouTube', scriptPath);

    // Spawn process
    const child = spawn('node', ['--experimental-strip-types', absoluteScriptPath], {
      cwd: '/Users/cesarue/Desktop/Proyecto YouTube',
      env: { 
        ...process.env,
        ...(options?.pilar ? { PROCESS_PILAR: options.pilar } : {})
      },
    });

    const pid = child.pid;
    updateStatus(script, {
      status: 'running',
      pid,
      startTime: new Date().toISOString(),
      endTime: null,
    });

    child.stdout.on('data', (data) => {
      fs.appendFileSync(logFile, data.toString());
    });

    child.stderr.on('data', (data) => {
      fs.appendFileSync(logFile, `[ERR] ${data.toString()}`);
    });

    child.on('close', (code) => {
      const endTime = new Date().toISOString();
      const statusNow = getStatus()[script];
      
      // Only change status to success/error if it wasn't manually stopped
      if (statusNow.status === 'running') {
        if (code === 0) {
          updateStatus(script, { status: 'success', pid: null, endTime });
        } else {
          updateStatus(script, { status: 'error', pid: null, endTime, exitCode: code });
        }
      }
      
      fs.appendFileSync(logFile, `\n=== FIN DE EJECUCIÓN: ${new Date().toLocaleString()} (Código de Salida: ${code}) ===\n`);
    });

    return NextResponse.json({ success: true, pid });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
