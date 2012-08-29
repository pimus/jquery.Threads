/**
 * jquery.Threads
 * A manager that controls threads a.k.a. execution of function simultaneously.
 * https://github.com/jstonne/jquery.Threads
 *
 * Copyright (c) 2012 Jensen Tonne & Jason Rey
 * www.jstonne.com
 *
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

(function() {

	var Tasks = function(options) {

		this.tasks = [];

		this.threads = 0;

		this.threadLimit = options.threadLimit;
	}

	Tasks.prototype.add = function(task) {

		if (!$.isFunction(task)) return;

		this.tasks.push({'normal': task});

		// Run task
		var instance = this;

		setTimeout(function(){ instance.run.apply(instance); }, 0);
	};

	Tasks.prototype.addDeferred = function(task) {
		if(!$.isFunction(task)) return;

		this.tasks.push({'deferred': task});
		this.run();
	};

	Tasks.prototype.run = function() {

		if (this.tasks.length > 0) {

			if (this.threads < this.threadLimit) {

				this.threads++;

				var task = this.tasks.shift();

				// Execute task
				if(task.deferred) {
					var func = task.deferred;
					var thread = $.Deferred();

					func.apply(thread);

					// When thread is complete
					thread.always(function(){

						// Reduce thread count
						this.threads--;

						// And see if there's anymore task to run
						this.run();
					});
				} else {
					var func = task.normal;
					try { func(); } catch(e) {}

					// Reduce thread count
					this.threads--;

					// And see if there's anymore task to run
					var instance = this;

					setTimeout(function(){ instance.run.apply(instance); }, 0);
				}
			}
		}
	};

	$.Tasks = function(options) {
		return new Tasks(options);
	};

})();
