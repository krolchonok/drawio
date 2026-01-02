/**
 * Copyright (c) 2006-2024, JGraph Holdings Ltd
 * Copyright (c) 2006-2024, draw.io AG
 */
// null'ing of global vars need to be after init.js
window.VSS_CONVERT_URL = null;
window.EMF_CONVERT_URL = null;
window.ICONSEARCH_PATH = null;

(function()
{
	if (window.mxConstants != null)
	{
		if (mxConstants.STYLE_ROTATE_LABELS == null)
		{
			mxConstants.STYLE_ROTATE_LABELS = 'rotateLabels';
		}
		
		if (mxConstants.STYLE_LABEL_ROTATION_DIRECTION == null)
		{
			mxConstants.STYLE_LABEL_ROTATION_DIRECTION = 'labelRotationDir';
		}
	}
	
	if (window.mxText != null && mxText.prototype != null)
	{
		if (mxText.prototype.getEdgeTextRotation == null)
		{
			mxText.prototype.getEdgeTextRotation = function()
			{
				var state = this.state;
				var angle = 0;
				
				if (state != null && state.absolutePoints != null && state.absolutePoints.length >= 2)
				{
					var label = state.absoluteOffset;
					var pts = state.absolutePoints;
					var best = null;
					var minDist = null;
					
					for (var i = 1; i < pts.length; i++)
					{
						var p0 = pts[i - 1];
						var p1 = pts[i];
						
						if (p0 != null && p1 != null)
						{
							var dist = (label != null) ?
								mxUtils.ptSegDistSq(p0.x, p0.y, p1.x, p1.y, label.x, label.y) : 0;
							
							if (minDist == null || dist < minDist)
							{
								minDist = dist;
								best = {p0: p0, p1: p1};
							}
						}
					}
					
					if (best != null)
					{
						angle = (180 * Math.atan2(best.p1.y - best.p0.y,
							best.p1.x - best.p0.x)) / Math.PI;
					}
				}
				
				var dir = (state != null) ? mxUtils.getNumber(state.style,
					mxConstants.STYLE_LABEL_ROTATION_DIRECTION, 1) : 1;
				
				if (dir == -1)
				{
					angle += 180;
				}
				
				return angle;
			};
		}
		
		if (!mxText.prototype.getTextRotationExt)
		{
			var originalGetTextRotation = mxText.prototype.getTextRotation;
			
			mxText.prototype.getTextRotation = function()
			{
				var rot = (originalGetTextRotation != null) ? originalGetTextRotation.apply(this, arguments) : 0;
				
				if (this.state != null && this.state.view != null)
				{
					var graph = this.state.view.graph;
					
					if (graph != null && graph.getModel().isEdge(this.state.cell) &&
						mxUtils.getValue(this.state.style, mxConstants.STYLE_ROTATE_LABELS, 0) != 0)
					{
						var edgeRot = this.getEdgeTextRotation();
						
						if (!isNaN(edgeRot))
						{
							rot = edgeRot;
						}
					}
				}
				
				return rot;
			};
			
			mxText.prototype.getTextRotationExt = true;
		}
	}
})();
