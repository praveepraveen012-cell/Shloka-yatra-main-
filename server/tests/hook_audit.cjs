const fs = require('fs');
const path = require('path');

const reactHooks = ['useState', 'useEffect', 'useMemo', 'useCallback', 'useRef', 'useContext', 'useReducer'];
const routerHooks = ['useNavigate', 'useLocation', 'useParams', 'useSearchParams'];

let missingCount = 0;

function scan(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) scan(full);
    else if (full.endsWith('.jsx') || full.endsWith('.js')) {
      const src = fs.readFileSync(full, 'utf8');
      reactHooks.forEach(hook => {
        const callRegex = new RegExp('\\b' + hook + '\\s*\\(');
        if (callRegex.test(src)) {
          const imported = new RegExp('import\\s+([^;]*\\b' + hook + '\\b[^;]*)\\s+from\\s+[\'\"]react[\'\"]').test(src) ||
                           new RegExp('const\\s*\\{[^}]*\\b' + hook + '\\b[^}]*\\}\\s*=\\s*React').test(src) ||
                           new RegExp('React\\.' + hook).test(src);
          if (!imported) {
            console.error('MISSING REACT HOOK in ' + full + ': ' + hook);
            missingCount++;
          }
        }
      });

      routerHooks.forEach(hook => {
        const callRegex = new RegExp('\\b' + hook + '\\s*\\(');
        if (callRegex.test(src)) {
          const imported = new RegExp('import\\s+([^;]*\\b' + hook + '\\b[^;]*)\\s+from\\s+[\'\"]react-router-dom[\'\"]').test(src);
          if (!imported) {
            console.error('MISSING ROUTER HOOK in ' + full + ': ' + hook);
            missingCount++;
          }
        }
      });
    }
  }
}

scan(path.join(__dirname, '../../client/src'));
if (missingCount === 0) {
  console.log('✅ ALL React and React Router hooks are properly imported across client/src!');
} else {
  console.error(`❌ Found ${missingCount} missing hook imports!`);
  process.exit(1);
}
