const requireAll = requireContext => requireContext.keys().map(requireContext);
const req = require.context('@/assets/images/menubar-icons', false, /\.svg$/);
export default requireAll(req);
