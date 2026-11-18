(function () {
  'use strict';

  // Keep deploy previews, local copies, and alternate hosts out of site analytics.
  if (window.location.hostname !== 'brendonrcoleman.com' &&
      window.location.hostname !== 'www.brendonrcoleman.com') {
    return;
  }

  if (document.getElementById('metricool-tracker')) {
    return;
  }

  var tracker = document.createElement('script');
  tracker.id = 'metricool-tracker';
  tracker.async = true;
  tracker.src = 'https://tracker.metricool.com/resources/be.js';
  tracker.onload = function () {
    if (window.beTracker && typeof window.beTracker.t === 'function') {
      window.beTracker.t({ hash: '68a22144e5edbce4efd04add98d9388c' });
    }
  };
  document.head.appendChild(tracker);
}());
